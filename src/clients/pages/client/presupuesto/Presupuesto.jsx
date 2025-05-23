import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ItemsTable from './components/ItemsTable';
import Summary from './components/Summary';
import Breadcrumb from '../../../../general/Breadcrumb';
import Dpdf from './components/Dpdf';
import { FaSave, FaPlus } from 'react-icons/fa';
import { api, apiConfig } from '../../../../config/api';

const Presupuesto = () => {
  const { client_id } = useParams();
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

            const jobResponse = await api.get(apiConfig.endpoints.projects);
            const projectData = jobResponse.data.find(project => project.project_id === parseInt(projectId));
            if (!projectData) {
                throw new Error('No se encontró el proyecto');
            }
            setJob(projectData);

            const clientResponse = await api.get(apiConfig.endpoints.clients);
            const clientData = clientResponse.data.find(client => client.client_id === projectData.client_id);
            setClient(clientData);

            const budgetResponse = await api.get(apiConfig.endpoints.budget.byProject(projectId));
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
        await api.delete(apiConfig.endpoints.budget.byId(itemToDelete.budget_id));
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
      const response = await api.post(apiConfig.endpoints.budget.base, newItem);
      if (response.data) {
          setItems(prevItems => [...prevItems, response.data]);
          console.log('Item agregado exitosamente:', response.data);
      }
  } catch (err) {
      console.error('Error adding new budget item:', err.response?.data?.error || err.message);
      alert(`Error al añadir nueva fila: ${err.response?.data?.error || err.message}`);
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
        await api.put(apiConfig.endpoints.budget.byId(items[0]?.budget_id), {
            gg_percentage: ggPercentage,
            gestion_percentage: gestionPercentage,
            gg_amount: ggValue,
            gestion_amount: gestionValue,
            subtotal: subtotal,
        });

        for (const item of items) {
            if (item.description && item.quantity > 0 && item.unit_price > 0) {
                await api.put(apiConfig.endpoints.budget.byId(item.budget_id), {
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
    items={items} // Agregar esta línea
  />
          </div>


        </div>
      </div>
    </div>

  );
};

export default Presupuesto;
