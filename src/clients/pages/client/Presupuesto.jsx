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
  const [items, setItems] = useState([{ description: '', quantity: 0, unitValue: 0, total: 0 }]);
  const [ggPercentage, setGgPercentage] = useState(20);
  const [gestionPercentage, setGestionPercentage] = useState(8);
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
      } catch (error) {
        console.error('Error fetching client or job:', error.message);
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

    if (
      updatedItems[index].description &&
      updatedItems[index].quantity &&
      updatedItems[index].unitValue &&
      index === updatedItems.length - 1
    ) {
      setItems([...updatedItems, { description: '', quantity: 0, unitValue: 0, total: 0 }]);
    }
  };

  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const formatCLP = (value) => {
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  };

  const total = items.reduce((total, item) => total + parseFloat(item.total || 0), 0);
  const ggValue = (total * ggPercentage) / 100;
  const gestionValue = (total * gestionPercentage) / 100;
  const subtotal = total + ggValue + gestionValue;

  const saveToLocalStorage = () => {
    const dataToSave = {
      total,
      gg: ggValue,
      gestion: gestionValue,
      subtotal,
      ggPercentage, 
      gestionPercentage 
    };
    alert('Datos guardados en el localStorage');
  };

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg">
        <div className="p-5">
          <Breadcrumb />          
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Presupuesto</h2>
          <p>ID del Proyecto: {projectId}</p> {/* Muestra la ID del proyecto */}
          <ClientInfo client={client} job={job} />

          <ItemsTable
            items={items}
            handleChange={handleChange}
            formatCLP={formatCLP}
            deleteItem={deleteItem}
          />

          <Summary
            total={total}
            ggPercentage={ggPercentage}
            gestionPercentage={gestionPercentage}
            ggValue={ggValue}
            gestionValue={gestionValue}
            subtotal={subtotal}
            formatCLP={formatCLP}
          />

          <button 
            className="mt-4 bg-red-800 text-white p-2 rounded"
            onClick={saveToLocalStorage}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Presupuesto;
