import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Asignacion from './components/Asignacion';
import ManoObra from './components/ManoObra';
import Breadcrumb from '../../../general/Breadcrumb'; 
import ClientInfo from './components/ClientInfo';
import { supabase } from '../../../supabase/client'; // Importar supabase o tu cliente de backend
import TablaRendicion from './components/TablaRendicion'; // Asegúrate de importar el componente

const Rendicion = () => {
  const { id, projectId } = useParams(); // Obtener id del cliente y projectId desde la URL
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
        // Obtener los datos del cliente
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('client_id', id)
          .single();

        if (clientError) {
          throw clientError;
        }

        setClient(clientData);

        // Obtener el trabajo (proyecto) asociado al cliente
        const { data: jobData, error: jobError } = await supabase
          .from('projects')
          .select('*')
          .eq('project_id', projectId)
          .single();

        if (jobError) {
          throw jobError;
        }

        setJob(jobData);

        // Obtener los proveedores
        const { data: proveedoresData, error: proveedoresError } = await supabase
          .from('proveedores')
          .select('*');

        if (proveedoresError) {
          throw proveedoresError;
        }

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
            proveedores={proveedores} // Pasar proveedores a la tabla
            handleProveedorChange={handleProveedorChange} // Pasar la función de cambio de proveedor
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