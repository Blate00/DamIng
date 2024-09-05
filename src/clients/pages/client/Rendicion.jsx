import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Asignacion from './components/Asignacion';
import ManoObra from './components/ManoObra';
import TablaRendicion from './components/TablaRendicion';
import Breadcrumb from '../../../general/Breadcrumb'; 
import ClientInfo from './components/ClientInfo';
  
const Rendicion = () => {
  const { id, jobId } = useParams();
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients[id];

  const [items, setItems] = useState([{ fecha: '', detalle: '', folio: '', proveedor: '', documento: '', total: '' }]);
  const [asignacion, setAsignacion] = useState(0);
  const [abonosAsignacion, setAbonosAsignacion] = useState([]);
  const [nuevoAbonoAsignacion, setNuevoAbonoAsignacion] = useState(0);
  const [manoObra, setManoObra] = useState(0);


  const [subtotal, setSubtotal] = useState(0);

useEffect(() => {
  const savedSubtotal = parseFloat(localStorage.getItem('subtotal')) || 0;
  setSubtotal(savedSubtotal);
}, []);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('items')) || [{ fecha: '', detalle: '', folio: '', proveedor: '', documento: '', total: '' }];
    const storedAsignacion = localStorage.getItem('asignacion') || '0';
    const storedManoObra = localStorage.getItem('manoObra') || '0';

    setItems(savedItems);
    setAsignacion(parseFloat(storedAsignacion));
    setManoObra(parseFloat(storedManoObra));
  }, []);

  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    if (field === 'quantity' || field === 'unitValue') {
      updatedItems[index].total = (updatedItems[index].quantity * updatedItems[index].unitValue).toFixed(2);
    }
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const agregarFila = () => {
    setItems([...items, { fecha: '', detalle: '', folio: '', proveedor: '', documento: '', total: '' }]);
  };

  const job = client?.jobs.find(job => job.id === jobId);
  if (!job) return <div>Trabajo no encontrado</div>;

  const totalRendicion = items.reduce((total, item) => total + (parseFloat(item.total) || 0), 0);
  const totalRecibidoAsignacion = abonosAsignacion.reduce((total, abono) => total + abono.monto, 0);
  const saldoActualAsignacion = totalRecibidoAsignacion;
  const saldoFinalAsignacion = totalRecibidoAsignacion - totalRendicion;

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
          />

        
    <div className="flex flex-col bg-white p-5 mb-10 shadow-md space-y-2">
            
            <div className="flex flex-col  space-y-2">
            <div className="flex justify-end   items-right">
                <span className="text-lg font-semibold text-gray-700">Resumen</span>
              
              </div>
             
              <div className="flex justify-end  items-right">
                <span className="text-sm font-medium px-2 text-gray-700">Total de Rendición: </span>
                <p className="text-sm text-red-600 font-semibold">
                   {totalRendicion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </p>
              </div>
              <div className="flex justify-end items-right">
                <span className="text-sm font-medium px-2 text-gray-700">Saldo Actual de Asignación:</span>
                <p className="text-sm text-red-600 font-semibold">
                  {saldoActualAsignacion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </p>
              </div>
              <div className="flex justify-end items-right">
                <span className="text-sm font-medium px-2 text-gray-700">Saldo Final de Asignación:</span>
                <p className="text-sm text-red-600 font-semibold">
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
