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
  const [items, setItems] = useState([{ fecha: '', detalle: '', folio: '', proveedor: '', documento: '', total: '' }]);
  const [asignacion, setAsignacion] = useState(0);
  const [abonosAsignacion, setAbonosAsignacion] = useState([]);
  const [nuevoAbonoAsignacion, setNuevoAbonoAsignacion] = useState(0);
  const [manoObra, setManoObra] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const fetchClientAndJob = async () => {
      try {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('client_id', id)
          .single();

        if (clientError) throw clientError;
        setClient(clientData);

        const { data: jobData, error: jobError } = await supabase
          .from('projects')
          .select('*')
          .eq('project_id', projectId)
          .single();

        if (jobError) throw jobError;
        setJob(jobData);

        const { data: proveedoresData, error: proveedoresError } = await supabase
          .from('proveedores')
          .select('*');

        if (proveedoresError) throw proveedoresError;
        setProveedores(proveedoresData);

      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientAndJob();
  }, [id, projectId]);

  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    if (field === 'total') {
      updatedItems[index].total = (parseFloat(updatedItems[index].total) || 0).toFixed(2);
    }
    setItems(updatedItems);
  };

  const agregarFila = () => {
    setItems([...items, { fecha: '', detalle: '', folio: '', proveedor: '', documento: '', total: '' }]);
  };

  const totalRendicion = items.reduce((total, item) => total + (parseFloat(item.total) || 0), 0);
  const totalRecibidoAsignacion = abonosAsignacion.reduce((total, abono) => total + abono.monto, 0);
  const saldoActualAsignacion = totalRecibidoAsignacion;
  const saldoFinalAsignacion = totalRecibidoAsignacion - totalRendicion;

  const handleProveedorChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].proveedor = value;
    setItems(updatedItems);
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
                  {saldoActualAsignacion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-md font-medium text-black">Saldo Final de Asignación:</span>
                <p className="text-md text-black font-bold">
                  {saldoFinalAsignacion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </p>
              </div>
            </div>
          </div>

          <Asignacion
            asignacion={asignacion}
            setAsignacion={setAsignacion}
            abonosAsignacion={abonosAsignacion}
            setAbonosAsignacion={setAbonosAsignacion}
            nuevoAbonoAsignacion={nuevoAbonoAsignacion}
            setNuevoAbonoAsignacion={setNuevoAbonoAsignacion}
          />

          <ManoObra manoObra={manoObra} setManoObra={setManoObra} subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
};

export default Rendicion;