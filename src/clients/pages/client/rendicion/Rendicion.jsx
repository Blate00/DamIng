import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Asignacion from './components/Asignacion';
import ManoObra from './components/ManoObra';
import Breadcrumb from '../../../../general/Breadcrumb';
import TablaRendicion from './components/TablaRendicion';

const Rendicion = () => {
  const { id, projectId } = useParams();
  const [client, setClient] = useState(null);
  const [job, setJob] = useState(null);
  const [items, setItems] = useState([]);
  const [asignacion, setAsignacion] = useState({ saldo_recibido: 0, saldo_actual: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proveedores, setProveedores] = useState([]);

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

        // Obtener rendiciones
        const rendicionesResponse = await axios.get(`http://localhost:5000/api/rendiciones/project/${projectId}`);
        setItems(rendicionesResponse.data);

        // Obtener proveedores
        const proveedoresResponse = await axios.get(`http://localhost:5000/api/proveedores`);
        setProveedores(proveedoresResponse.data);

        // Obtener datos del cliente
        const clientResponse = await axios.get(`http://localhost:5000/api/clients`);
        const clientData = clientResponse.data.find(client => client.client_id === parseInt(id));
        setClient(clientData);

        if (rendicionesResponse.data.length === 0) {
          agregarFila();
        }

      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, projectId]);

  const deleteItem = async (index) => {
    try {
      const itemToDelete = items[index];
      if (itemToDelete.rendicion_id) {
        await axios.delete(`http://localhost:5000/api/rendiciones/${itemToDelete.rendicion_id}`);
      }
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
    } catch (error) {
      console.error('Error deleting item:', error.message);
    }
  };

  const handleChange = async (index, field, value) => {
    try {
      const updatedItems = [...items];
      updatedItems[index][field] = value;
      
      if (field === 'total') {
        updatedItems[index].total = parseFloat(value) || 0;
      }

      if (updatedItems[index].rendicion_id) {
        await axios.put(`http://localhost:5000/api/rendiciones/${updatedItems[index].rendicion_id}`, {
          ...updatedItems[index],
          [field]: value
        });
      } else {
        const response = await axios.post(`http://localhost:5000/api/rendiciones`, {
          project_id: projectId,
          quote_number: job.quote_number,
          ...updatedItems[index]
        });
        updatedItems[index] = response.data;
      }

      setItems(updatedItems);
    } catch (error) {
      console.error('Error updating item:', error.message);
    }
  };

  const agregarFila = () => {
    const newItem = {
      project_id: projectId,
      quote_number: job?.quote_number,
      fecha: new Date().toISOString().split('T')[0],
      detalle: '',
      folio: '',
      proveedor: '',
      documento: '',
      total: 0
    };
    setItems([...items, newItem]);
  };

  const handleProveedorChange = async (index, value) => {
    try {
      const updatedItems = [...items];
      const proveedor = proveedores.find(p => p.nombre.toLowerCase() === value.toLowerCase());
      
      if (proveedor && updatedItems[index].rendicion_id) {
        await axios.put(`http://localhost:5000/api/rendiciones/${updatedItems[index].rendicion_id}`, {
          proveedor_id: proveedor.proveedor_id
        });
        updatedItems[index].proveedor = value;
        setItems(updatedItems);
      }
    } catch (error) {
      console.error('Error updating proveedor:', error.message);
    }
  };

  const formatCLP = (value) => {
    if (value == null || isNaN(value)) return '\$0';
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };

  const totalRendicion = items.reduce((total, item) => total + (parseFloat(item.total) || 0), 0);
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
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg">
        <div className="p-5">
          <Breadcrumb />   
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Rendición</h2>

          <TablaRendicion
        items={items}
        handleChange={handleChange}
        agregarFila={agregarFila}
        deleteItem={deleteItem}
        proveedores={proveedores}
        handleProveedorChange={handleProveedorChange}
        formatCLP={formatCLP}
      />

          <div className="flex flex-col bg-gray-100 p-6 border-r border-l border-b border-gray-300  mb-10 rounded-b-lg shadow-lg space-y-4">
            <div className="flex flex-col space-y-3">
           
              <div className="flex justify-between items-center  border-gray-200">
                <span className="text-md font-medium text-black">Total:</span>
                <p className="text-base text-red-700 font-bold">
                  {totalRendicion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-md font-medium text-black">Saldo Actual:</span>
                <p className="text-base text-red-700 font-bold">
                  {asignacion.saldo_recibido.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-md font-medium text-black">Saldo Final:</span>
                <p className="text-base text-red-700 font-bold">
                  {(asignacion.saldo_recibido - totalRendicion).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </p>
              </div>
            </div>
          </div>

          <Asignacion
  job={job}
  updateAsignacion={setAsignacion}
/>

          <ManoObra manoObra={0} setManoObra={() => {}} subtotal={0} />
        </div>
      </div>
    </div>
  );
};

export default Rendicion;