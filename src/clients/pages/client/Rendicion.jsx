import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Asignacion from './components/Asignacion';
import ManoObra from './components/ManoObra';
import Breadcrumb from '../../../general/Breadcrumb'; 
import ClientInfo from './components/ClientInfo';
import { supabase } from '../../../supabase/client';
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
        const [clientData, jobData, proveedoresData, rendicionesData] = await Promise.all([
          supabase.from('clients').select('*').eq('client_id', id).single(),
          supabase.from('projects').select('*').eq('project_id', projectId).single(),
          supabase.from('proveedores').select('*'),
          supabase.from('rendiciones').select('*').eq('project_id', projectId),
        ]);
  
        if (clientData.error) throw clientData.error;
        if (jobData.error) throw jobData.error;
        if (proveedoresData.error) throw proveedoresData.error;
        if (rendicionesData.error) throw rendicionesData.error;
  
        setClient(clientData.data);
        setJob(jobData.data);
        setProveedores(proveedoresData.data);
        setItems(rendicionesData.data || []);
  
        // La asignación se manejará en el componente Asignacion
  
        if (rendicionesData.data.length === 0) {
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
        const { error } = await supabase
          .from('rendiciones')
          .delete()
          .eq('rendicion_id', itemToDelete.rendicion_id);
        if (error) throw error;
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
        if (field === 'proveedor') {
          // Si el campo es 'proveedor', usa handleProveedorChange en su lugar
          await handleProveedorChange(index, value);
        } else {
          const { error } = await supabase
            .from('rendiciones')
            .update({ [field]: value })
            .eq('rendicion_id', updatedItems[index].rendicion_id);
          if (error) throw error;
        }
      } else {
        const { data, error } = await supabase.rpc('insert_rendicion', {
          p_project_id: projectId,
          p_quote_number: job.quote_number,
          p_fecha: updatedItems[index].fecha,
          p_detalle: updatedItems[index].detalle,
          p_folio: updatedItems[index].folio,
          p_proveedor_nombre: updatedItems[index].proveedor,
          p_documento: updatedItems[index].documento,
          p_total: updatedItems[index].total
        });
        if (error) throw error;
        updatedItems[index].rendicion_id = data;
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
      updatedItems[index].proveedor = value;
  
      // Buscar el proveedor por nombre
      const proveedor = proveedores.find(p => p.nombre.toLowerCase() === value.toLowerCase());
  
      if (updatedItems[index].rendicion_id) {
        if (proveedor) {
          // Si se encontró el proveedor, actualizar con su ID
          const { error } = await supabase
            .from('rendiciones')
            .update({ proveedor_id: proveedor.proveedor_id })
            .eq('rendicion_id', updatedItems[index].rendicion_id);
          if (error) throw error;
        } else {
          // Si no se encontró el proveedor, puedes manejar esto de diferentes maneras:
          // 1. No actualizar el proveedor_id en la base de datos
          // 2. Crear un nuevo proveedor (si tu aplicación lo permite)
          // 3. Mostrar un mensaje de error al usuario
          console.warn(`Proveedor "${value}" no encontrado`);
          // Opcionalmente, puedes lanzar un error aquí si quieres que se maneje como una excepción
          // throw new Error(`Proveedor "${value}" no encontrado`);
        }
      }
  
      setItems(updatedItems);
    } catch (error) {
      console.error('Error updating proveedor:', error.message);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
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
          <ClientInfo client={client} job={job} />

          <TablaRendicion
            items={items}
            handleChange={handleChange}
            agregarFila={agregarFila}
            deleteItem={deleteItem}
            proveedores={proveedores}
            handleProveedorChange={handleProveedorChange}
          />

          <div className="flex flex-col bg-gray-100 p-6 border-r border-l border-b border-gray-300  mb-10 rounded-b-lg shadow-lg space-y-4">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-black">Resumen</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-md font-medium text-black">Total de Rendición:</span>
                <p className="text-md text-black font-bold">
                  {totalRendicion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-md font-medium text-black">Saldo Actual de Asignación:</span>
                <p className="text-md text-black font-bold">
                  {asignacion.saldo_recibido.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-md font-medium text-black">Saldo Final de Asignación:</span>
                <p className="text-md text-black font-bold">
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