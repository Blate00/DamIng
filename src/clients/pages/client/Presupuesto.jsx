import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClientInfo from './components/ClientInfo';
import ItemsTable from './components/ItemsTable';
import Summary from './components/Summary';
import Breadcrumb from '../../../general/Breadcrumb'; 
import { supabase } from '../../../supabase/client'; // Importar supabase o tu cliente de backend

const Presupuesto = () => {
  const { id, projectId } = useParams(); // Obtener id del cliente y projectId desde la URL
  const [client, setClient] = useState(null);
  const [job, setJob] = useState(null);
  const [items, setItems] = useState([]);
  const [ggPercentage, setGgPercentage] = useState(0);
  const [gestionPercentage, setGestionPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientAndJob = async () => {
      try {
        // Obtenemos los datos del cliente
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('client_id', id)
          .single();

        if (clientError) {
          throw clientError;
        }

        setClient(clientData);

        // Obtenemos el trabajo (proyecto) asociado al cliente
        const { data: jobData, error: jobError } = await supabase
          .from('projects')
          .select('*')
          .eq('project_id', projectId)
          .single();

        if (jobError) {
          throw jobError;
        }

        setJob(jobData);

        // Obtenemos los presupuestos existentes para el proyecto
        const { data: budgetData, error: budgetError } = await supabase
          .from('description_budgets')
          .select('*')
          .eq('project_id', projectId);

        if (budgetError) {
          throw budgetError;
        }

        setItems(budgetData || []);

        // Si hay datos de presupuesto, toma los porcentajes del primer elemento
        if (budgetData.length > 0) {
          setGgPercentage(budgetData[0].gg_percentage || 0);
          setGestionPercentage(budgetData[0].gestion_percentage || 0);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientAndJob();
  }, [id, projectId]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!client) {
    return <div>Cliente no encontrado</div>;
  }

  if (!job) {
    return <div>Trabajo no encontrado</div>;
  }

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === 'quantity' || field === 'unitValue') {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const unitValue = parseFloat(updatedItems[index].unitValue) || 0;
      updatedItems[index].total = (quantity * unitValue).toFixed(2);
    }

    setItems(updatedItems);
  };

  const deleteItem = async (index) => {
    const itemToDelete = items[index];
    try {
      const { error } = await supabase
        .from('description_budgets')
        .delete()
        .eq('budget_id', itemToDelete.budget_id);

      if (error) {
        throw error;
      }

      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
    } catch (error) {
      console.error('Error deleting budget:', error.message);
      alert('Error al eliminar el presupuesto.');
    }
  };

  const addNewItem = async () => {
    try {
      const { data, error } = await supabase
        .from('description_budgets')
        .insert({
          project_id: projectId,
          quote_number: job.quote_number,
          description: '',
          quantity: 0,
          unit_price: 0,
          total: 0,
          gg_percentage: ggPercentage,
          gestion_percentage: gestionPercentage,
          gg_amount: 0,
          gestion_amount: 0,
          subtotal: 0
        })
        .select();

      if (error) {
        throw error;
      }

      setItems([...items, ...data]);
    } catch (error) {
      console.error('Error adding new budget item:', error.message);
      alert('Error al añadir una nueva fila.');
    }
  };

  const formatCLP = (value) => {
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  };

  const total = items.reduce((total, item) => total + parseFloat(item.total || 0), 0);
  const ggValue = (total * ggPercentage) / 100;
  const gestionValue = (total * gestionPercentage) / 100;
  const subtotal = total + ggValue + gestionValue;

  const updateDatabase = async () => {
    try {
      for (const item of items) {
        if (item.description && item.quantity > 0 && item.unitValue > 0) {
          const { error } = await supabase
            .from('description_budgets')
            .update({
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unitValue,
              total: item.total,
              gg_percentage: ggPercentage,
              gestion_percentage: gestionPercentage,
              gg_amount: ggValue,
              gestion_amount: gestionValue,
              subtotal: subtotal
            })
            .eq('budget_id', item.budget_id);

          if (error) {
            throw error;
          }
        }
      }
      alert('Presupuesto actualizado exitosamente en la base de datos.');
    } catch (error) {
      console.error('Error updating budget:', error.message);
      alert('Error al actualizar el presupuesto.');
    }
  };

  return (
    <div className="flex flex-col p-3  h-full">
      <div className="bg-white h-full rounded-lg">
        <div className="p-5">
          <Breadcrumb />          
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Presupuesto</h2>
          <ClientInfo client={client} job={job} />

          <ItemsTable
            items={items}
            handleChange={handleChange}
            formatCLP={formatCLP}
            deleteItem={deleteItem}
          />

         

          <Summary
            total={total}
            projectId={projectId}
            formatCLP={formatCLP}
          />

          <button 
            className="mt-4 bg-red-800 text-white p-2 rounded"
            onClick={updateDatabase}
          >
            Guardar
          </button> <button 
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