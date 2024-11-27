// Presupuesto.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ItemsTable from './components/ItemsTable';
import Summary from './components/Summary';
import Breadcrumb from '../../../../general/Breadcrumb';
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import damLogo from '../../../../assets/damLogo.png'; // Asegúrate de que la extensión sea correcta (.png, .jpg, etc.)
import Dpdf from './components/Dpdf'; 
import { FaSave, FaPlus } from 'react-icons/fa';
const Presupuesto = () => {
    const { client_id } = useParams(); // Obtener client_id de la URL
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
  
        // Obtener datos del cliente
        const clientResponse = await axios.get(`http://localhost:5000/api/clients/`);
        const clientData = clientResponse.data.find(client => client.client_id === projectData.client_id);
        setClient(clientData);
  
        // Obtener presupuestos
        const budgetResponse = await axios.get(`http://localhost:5000/api/presupuesto/${projectId}`);
        setItems(budgetResponse.data);
        
        if (budgetResponse.data.length > 0) {
          setGgPercentage(budgetResponse.data[0].gg_percentage || 0);
          setGestionPercentage(budgetResponse.data[0].gestion_percentage || 0);
        }
  
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
  };
  const generatePDF = async () => {
    try {
      // Crear el PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
    
      // Configuración de estilos y colores
      const styles = {
        colors: {
          primary: [139, 0, 0],    // Rojo DAM
          white: [255, 255, 255],
          gray: [245, 245, 245],
          text: [51, 51, 51]
        },
        margins: {
          left: 10,
          top: 10
        }
      };
    
      // Cargar logo
      const loadImage = () => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = reject;
          img.src = damLogo;
        });
      };
    
      const logoDataUrl = await loadImage();
    
      // Header con logo
      pdf.addImage(logoDataUrl, 'PNG', styles.margins.left, styles.margins.top, 40, 30);
    
      // Información del proyecto
      pdf.setFontSize(16);
      pdf.setTextColor(...styles.colors.text);
      const projectTitle = job?.project_name || 'Proyecto sin nombre';
      pdf.text(projectTitle, 55, 25);
    
      // Información adicional
      pdf.setFontSize(11);
      const quoteNumber = `Nº CTZ: ${job?.quote_number || 'Sin número'}`;
      const currentDate = new Date().toLocaleDateString('es-CL');
      const clientName = client?.name || 'Cliente sin nombre';
    
      pdf.text(quoteNumber, 160, 20);
      pdf.text(currentDate, 160, 25);
      pdf.text(clientName, 55, 35);
    
      // Línea separadora
      pdf.setDrawColor(...styles.colors.primary);
      pdf.setLineWidth(0.5);
      pdf.line(10, 40, 200, 40);
    
      // Título "Servicios Eléctricos"
      pdf.setFontSize(20  );
      pdf.setTextColor(...styles.colors.text);
      pdf.text('Presupuesto', 10, 45);
    
      // Configuración de la tabla
      const startY = 50;
      const tableHeaders = [
        { text: 'ITEM', width: 15 },
        { text: 'DESCRIPCIÓN', width: 80 },
        { text: 'UND', width: 20 },
        { text: 'CANTIDAD', width: 25 },
        { text: 'VALOR UNIT', width: 25 },
        { text: 'TOTAL', width: 25 }
      ];
    
      // Encabezado de la tabla
      pdf.setFillColor(...styles.colors.primary);
      pdf.rect(10, startY, 190, 10, 'F');
      pdf.setTextColor(...styles.colors.white);
      pdf.setFontSize(10);
    
      let currentX = 10;
      tableHeaders.forEach(header => {
        pdf.text(header.text, currentX + 2, startY + 7);
        currentX += header.width;
      });
    
      // Contenido de la tabla
      let currentY = startY + 10;
      items.forEach((item, index) => {
        pdf.setTextColor(...styles.colors.text);
    
        // Fondo alternado
        if (index % 2 === 0) {
          pdf.setFillColor(...styles.colors.gray);
          pdf.rect(10, currentY, 190, 8, 'F');
        }
    
        currentX = 10;
        // Item número
        pdf.text(String(index + 1), currentX + 2, currentY + 6);
        currentX += tableHeaders[0].width;
    
        // Descripción
        const description = item.description || '';
        if (description.length > 40) {
          pdf.setFontSize(8);
        }
        pdf.text(description, currentX + 2, currentY + 6);
        pdf.setFontSize(10);
        currentX += tableHeaders[1].width;
    
        // Unidad
        pdf.text(item.und || '', currentX + 2, currentY + 6);
        currentX += tableHeaders[2].width;
    
        // Cantidad
        pdf.text(String(item.quantity || ''), currentX + 2, currentY + 6);
        currentX += tableHeaders[3].width;
    
        // Valor unitario
        pdf.text(formatCLP(item.unit_price), currentX + 2, currentY + 6);
        currentX += tableHeaders[4].width;
    
        // Total
        pdf.text(formatCLP(item.total), currentX + 2, currentY + 6);
    
        currentY += 8;
      });
    
      // Resumen y totales
      currentY += 10;
      const summaryX = 130;
      const summaryWidth = 70;
    
      const renderSummaryRow = (label, value, isHighlighted = false) => {
        if (isHighlighted) {
          pdf.setFillColor(...styles.colors.primary);
          pdf.rect(summaryX - 5, currentY - 5, summaryWidth + 5, 10, 'F');
          pdf.setTextColor(...styles.colors.white);
        } else {
          pdf.setTextColor(...styles.colors.text);
        }
    
        pdf.text(label, summaryX, currentY + 2);
        pdf.text(value, summaryX + summaryWidth - 2, currentY + 2, { align: 'right' });
        currentY += 12;
      };
    
      // Calcular totales
      const totalNeto = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
      const ggAmount = (totalNeto * ggPercentage) / 100;
      const gestionAmount = (totalNeto * gestionPercentage) / 100;
      const subtotal = totalNeto + ggAmount + gestionAmount;
    
      // Renderizar resumen
      renderSummaryRow('Total Neto:', formatCLP(totalNeto));
      renderSummaryRow('GG (%):', `${ggPercentage}% ${formatCLP(ggAmount)}`);
      renderSummaryRow('Gestión (%):', `${gestionPercentage}% ${formatCLP(gestionAmount)}`);
      renderSummaryRow('Subtotal:', formatCLP(subtotal), true);
    
      // Pie de página
      pdf.setTextColor(128, 128, 128);
      pdf.setFontSize(8);
      const footerText = `Documento generado el ${currentDate} | Proyecto: ${projectTitle} | Cliente: ${clientName} | CTZ: ${job?.quote_number}`;
      pdf.text(
        footerText,
        pdf.internal.pageSize.width / 2,
        pdf.internal.pageSize.height - 10,
        { align: 'center' }
      );
    
      // Guardar PDF
      const fileName = `presupuesto_${job?.quote_number || 'sin_numero'}_${currentDate.replace(/\//g, '-')}.pdf`;
      pdf.save(fileName);
    
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
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
          <div className="p-4 bg-white shadow-md rounded-tl-lg rounded-tr-lg border-l-4 border-red-800">
  <p className="text-gray-900 font-semibold text-lg">Cliente:</p>
  <p className="text-gray-800 text-base">{client?.name}</p>
  
  <div className="mt-4">
    <p className="text-gray-900 font-semibold text-lg">Proyecto:</p>
    <p className="text-gray-800 text-base">{job?.project_name}</p>
  </div>
</div>

          <div className="p-4 bg-white rounded-b-lg border-l-4 border-red-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Servicios Eléctricos</h2>
              <div className="mt- text-end flex space-x-4">
  <button
    className="flex items-center space-x-2 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
    onClick={updateDatabase}
  >
    <FaSave className="text-lg" />
  </button>

  <button
    className="flex items-center space-x-2 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
    onClick={addNewItem}
  >
    <FaPlus className="text-lg" />
  </button>

  {/* Dpdf como botón */}
<Dpdf job={job} client={client} items={items} formatCLP={formatCLP} ggPercentage={ggPercentage} gestionPercentage={gestionPercentage} />
</div>



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
      
           
          </div>
        </div>
      </div>
      
  );
};

export default Presupuesto;
