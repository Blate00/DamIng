// Presupuesto.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ItemsTable from './components/ItemsTable';
import Summary from './components/Summary';
import Breadcrumb from '../../../../general/Breadcrumb';

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
    <div className="flex flex-col p-3 h-full">
    <div className="h-full rounded-lg">
      <div className="p-5">
        <Breadcrumb />
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Presupuesto</h2>

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
