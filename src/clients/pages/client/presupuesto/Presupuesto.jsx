// Presupuesto.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ItemsTable from './components/ItemsTable';
import Summary from './components/Summary';
import Breadcrumb from '../../../../general/Breadcrumb';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
const Presupuesto = () => {
  const { projectId } = useParams();
  const [client, setClient] = useState(null);
  const [job, setJob] = useState(null);
  const [items, setItems] = useState([]);
  const [ggPercentage, setGgPercentage] = useState(0);
  const [gestionPercentage, setGestionPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos del proyecto
        const jobResponse = await axios.get(`http://localhost:5000/api/projects`);
        const projectData = jobResponse.data.find(project => project.project_id === parseInt(projectId));
        if (!projectData) {
          throw new Error('No se encontró el proyecto');
        }
        setJob(projectData);

        // Obtener presupuestos
        const budgetResponse = await axios.get(`http://localhost:5000/api/presupuesto/${projectId}`);
        setItems(budgetResponse.data);
        
        if (budgetResponse.data.length > 0) {
          setGgPercentage(budgetResponse.data[0].gg_percentage || 0);
          setGestionPercentage(budgetResponse.data[0].gestion_percentage || 0);
        }

        // Obtener datos del cliente si es necesario
        const clientResponse = await axios.get(`http://localhost:5000/api/clients`);
        setClient(clientResponse.data);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === 'quantity' || field === 'unit_price') {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const unitPrice = parseFloat(updatedItems[index].unit_price) || 0;
      updatedItems[index].total = (quantity * unitPrice).toFixed(2);
    }

    setItems(updatedItems);
  };

  const deleteItem = async (index) => {
    const itemToDelete = items[index];
    try {
      await axios.delete(`http://localhost:5000/api/presupuesto/${itemToDelete.budget_id}`);
      setItems(items.filter((_, i) => i !== index));
    } catch (err) {
      console.error('Error deleting budget:', err.message);
      alert('Error al eliminar el presupuesto.');
    }
  };
  const addNewItem = async () => {
    if (!job) {
      alert('Error: Información del trabajo no disponible');
      return;
    }

    if (!job.quote_number) {
      alert('Error: No hay un número de cotización válido para este proyecto');
      return;
    }

    const newItem = {
      project_id: parseInt(projectId),
      quote_number: job.quote_number,
      description: '',
      quantity: 0,
      unit_price: 0,
      total: 0,
      gg_percentage: ggPercentage || 0,
      gestion_percentage: gestionPercentage || 0,
      gg_amount: 0,
      gestion_amount: 0,
      subtotal: 0
    };

    try {
      console.log('Enviando nuevo item:', newItem);
      const response = await axios.post('http://localhost:5000/api/presupuesto', newItem);
      if (response.data) {
        setItems(prevItems => [...prevItems, response.data]);
        console.log('Item agregado exitosamente:', response.data);
      }
    } catch (err) {
      console.error('Error adding new budget item:', err.response?.data?.error || err.message);
      alert(`Error al añadir nueva fila: ${err.response?.data?.error || err.message}`);
    }
  };

  // Modificar también el useEffect para asegurar que obtenemos el quote_number
  
  const formatCLP = (value) => {
    if (value == null || isNaN(value)) return '$0';
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };  

  const total = items.reduce((total, item) => total + parseFloat(item.total || 0), 0);
  const ggValue = (total * ggPercentage) / 100;
  const gestionValue = (total * gestionPercentage) / 100;
  const subtotal = total + ggValue + gestionValue;

  const updateDatabase = async () => {
    try {
      await axios.put(`http://localhost:5000/api/presupuesto/${items[0]?.budget_id}`, {
        gg_percentage: ggPercentage,
        gestion_percentage: gestionPercentage,
        gg_amount: ggValue,
        gestion_amount: gestionValue,
        subtotal: subtotal,
      });

      for (const item of items) {
        if (item.description && item.quantity > 0 && item.unit_price > 0) {
          await axios.put(`http://localhost:5000/api/presupuesto/${item.budget_id}`, {
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
            gg_percentage: ggPercentage,
            gestion_percentage: gestionPercentage,
            gg_amount: ggValue,
            gestion_amount: gestionValue,
            subtotal: subtotal,
          });
        }
      }
      alert('Presupuesto actualizado exitosamente en la base de datos.');
    } catch (err) {
      console.error('Error updating budget:', err.message);
      alert('Error al actualizar el presupuesto.');
    }
  };const generatePDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
    
      // Configuración de fuentes y colores
      pdf.addFont('helvetica', 'normal');
      pdf.setFont('helvetica');
    
      // Agregar un fondo suave al encabezado
      pdf.setFillColor(245, 245, 245);
      pdf.rect(0, 0, 210, 40, 'F');
    
      // Logo o título principal
      pdf.setFontSize(24);
      pdf.setTextColor(139, 0, 0); // Color rojo oscuro
      pdf.text('PRESUPUESTO', 105, 20, { align: 'center' });
    
      // Línea decorativa
      pdf.setDrawColor(139, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(20, 25, 190, 25);
    
      // Información del cliente y proyecto
      pdf.setFontSize(12);
      pdf.setTextColor(60, 60, 60);
      pdf.setFont('helvetica', 'bold');
    
      const infoY = 45;
      pdf.text('CLIENTE:', 20, infoY);
      pdf.setFont('helvetica', 'normal');
      pdf.text(client?.name || '', 60, infoY);
    
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROYECTO:', 20, infoY + 10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(job?.project_name || '', 60, infoY + 10);
    
      pdf.setFont('helvetica', 'bold');
      pdf.text('FECHA:', 20, infoY + 20);
      pdf.setFont('helvetica', 'normal');
      pdf.text(new Date().toLocaleDateString('es-CL'), 60, infoY + 20);
    
      // Tabla con diseño mejorado
      const startY = 80;
      const columns = [
        { header: 'DESCRIPCIÓN', width: 80, align: 'left' },
        { header: 'CANTIDAD', width: 30, align: 'center' },
        { header: 'VALOR UNITARIO', width: 35, align: 'right' },
        { header: 'TOTAL', width: 35, align: 'right' }
      ];
    
      // Encabezado de tabla con degradado
      pdf.setFillColor(139, 0, 0);
      let currentX = 20;
      columns.forEach(column => {
        // Fondo del encabezado
        pdf.rect(currentX, startY, column.width, 10, 'F');
    
        // Texto del encabezado
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(column.header, 
          column.align === 'center' ? currentX + (column.width/2) : 
          column.align === 'right' ? currentX + column.width - 2 : 
          currentX + 2, 
          startY + 7, 
          { align: column.align });
    
        currentX += column.width;
      });
    
      // Filas de datos con alternancia de colores
      pdf.setTextColor(60, 60, 60);
      let currentY = startY + 10;
    
      items.forEach((item, index) => {
        // Fondo alternado para las filas
        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(20, currentY, 180, 10, 'F');
        }
    
        currentX = 20;
        pdf.setFont('helvetica', 'normal');
    
        // Descripción
        pdf.text(item.description || '', currentX + 2, currentY + 7);
        currentX += columns[0].width;
    
        // Cantidad
        pdf.text(item.quantity?.toString() || '', currentX + (columns[1].width/2), currentY + 7, { align: 'center' });
        currentX += columns[1].width;
    
        // Valor unitario
        pdf.text(formatCLP(item.unit_price) || '', currentX + columns[2].width - 2, currentY + 7, { align: 'right' });
        currentX += columns[2].width;
    
        // Total
        pdf.text(formatCLP(item.total) || '', currentX + columns[3].width - 2, currentY + 7, { align: 'right' });
    
        currentY += 10;
      });
    
      // Resumen con diseño mejorado
      currentY += 10;
      const summaryX = 120;
      const summaryWidth = 70;
    
      // Fondo para el resumen
      pdf.setFillColor(245, 245, 245);
      pdf.rect(summaryX - 5, currentY - 5, summaryWidth + 10, 50, 'F');
    
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total:', summaryX, currentY);
      pdf.setFont('helvetica', 'normal');
      pdf.text(formatCLP(total), summaryX + summaryWidth, currentY, { align: 'right' });
    
      currentY += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text('GG (%):', summaryX, currentY);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${ggPercentage}%`, summaryX + 30, currentY);
      pdf.text(formatCLP((total * ggPercentage) / 100), summaryX + summaryWidth, currentY, { align: 'right' });
    
      currentY += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Gestión (%):', summaryX, currentY);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${gestionPercentage}%`, summaryX + 30, currentY);
      pdf.text(formatCLP((total * gestionPercentage) / 100), summaryX + summaryWidth, currentY, { align: 'right' });
    
      // Subtotal con fondo destacado
      currentY += 15;
      pdf.setFillColor(139, 0, 0);
      pdf.rect(summaryX - 5, currentY - 5, summaryWidth + 10, 12, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SUBTOTAL:', summaryX, currentY);
      pdf.text(formatCLP(total + (total * ggPercentage) / 100 + (total * gestionPercentage) / 100), 
        summaryX + summaryWidth, currentY, { align: 'right' });
    
      // Pie de página
      pdf.setTextColor(128, 128, 128);
      pdf.setFontSize(8);
      pdf.text(
        `Generado el ${new Date().toLocaleDateString('es-CL')} - Página 1 de 1`,
        pdf.internal.pageSize.width / 2,
        pdf.internal.pageSize.height - 10,
        { align: 'center' }
      );
    
      // Guardar PDF
      pdf.save(`presupuesto_${job?.quote_number || 'sin_numero'}.pdf`);
    
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error al generar el PDF');
    }
    };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Cliente no encontrado</h2>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Trabajo no encontrado</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-5 h-full">
    <div className="h-full rounded-xl">
      <Breadcrumb />
      <div className="p-4 bg-white rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Presupuesto</h2>
          <button
            onClick={generatePDF}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Descargar PDF
          </button>
        </div>

        <div id="pdf-content">
          <ItemsTable
            items={items}
            handleChange={handleChange}
            formatCLP={formatCLP}
            deleteItem={deleteItem}
          />

          <Summary 
            total={total} 
            formatCLP={formatCLP} 
            budgetId={items.length > 0 ? items[0].budget_id : null} 
            ggPercentage={ggPercentage} 
            setGgPercentage={setGgPercentage} 
            gestionPercentage={gestionPercentage} 
            setGestionPercentage={setGestionPercentage} 
          />
        </div>

        <div className="mt-4 space-x-2">
          <button
            className="bg-red-800 text-white p-2 rounded hover:bg-red-700"
            onClick={updateDatabase}
          >
            Guardar
          </button>
          <button
            className="bg-red-700 text-white p-2 rounded hover:bg-red-600"
            onClick={addNewItem}
          >
            Añadir Nueva Fila
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Presupuesto;
