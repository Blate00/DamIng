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
        const clientResponse = await axios.get(`http://localhost:5000/api/clients/`);
        setClient(clientResponse.data);

        const jobResponse = await axios.get(`http://localhost:5000/api/projects/`);
        setJob(jobResponse.data);

        const budgetResponse = await axios.get(`http://localhost:5000/api/presupuesto/${projectId}`);
        setItems(budgetResponse.data);
        if (budgetResponse.data.length > 0) {
          setGgPercentage(budgetResponse.data[0].gg_percentage || 0);
          setGestionPercentage(budgetResponse.data[0].gestion_percentage || 0);
        }
      } catch (err) {
        console.error('Error fetching data:', err.message);
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
    const newItem = {
      project_id: projectId,
      quote_number: job.quote_number || '', // Asegúrate de que este campo tenga un valor válido
      description: '', // Puede estar vacío al crear un nuevo ítem
      quantity: 0, // Valores numéricos inicializados a 0
      unit_price: 0,
      total: 0,
      gg_percentage: ggPercentage || 0, // Asegúrate de que no sean `undefined`
      gestion_percentage: gestionPercentage || 0,
      gg_amount: 0,
      gestion_amount: 0,
      subtotal: 0
   
    };
  
    console.log('Sending new item:', newItem);  // Revisa los valores enviados
  
    try {
      const response = await axios.post('http://localhost:5000/api/presupuesto', newItem);
      setItems([...items, response.data]);
    } catch (err) {
      console.error('Error adding new budget item:', err.message);
      alert('Error al añadir una nueva fila.');
    }
  };
  
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

          <button
            className="mt-4 bg-red-800 text-white p-2 rounded mr-2"
            onClick={updateDatabase}
          >
            Guardar
          </button>
          <button
            className="mt-4 bg-red-700 text-white p-2 rounded"
            onClick={addNewItem}
          >
            Añadir Nueva Fila
          </button>
        </div>
      </div>
    </div>
  );
};

export default Presupuesto;
