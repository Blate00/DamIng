import React, { useState, useEffect } from 'react';
import Asignacion from './components/Asignacion';
import ManoObra from './components/ManoObra';
import TablaRendicion from './components/TablaRendicion';

const Rendicion = () => {
  const [items, setItems] = useState([{ fecha: '', detalle: '', folio: '', proveedor: '', documento: '', total: '' }]);
  const [asignacion, setAsignacion] = useState(0);
  const [abonosAsignacion, setAbonosAsignacion] = useState([]);
  const [nuevoAbonoAsignacion, setNuevoAbonoAsignacion] = useState(0);
  const [manoObra, setManoObra] = useState(0);

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

  const editItem = (index, updatedFields) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], ...updatedFields };
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const totalRendicion = items.reduce((total, item) => total + (parseFloat(item.total) || 0), 0);
  const totalRecibidoAsignacion = abonosAsignacion.reduce((total, abono) => total + abono.monto, 0);
  const saldoActualAsignacion = totalRecibidoAsignacion;
  const saldoFinalAsignacion = totalRecibidoAsignacion - totalRendicion;

  return (
    <div className="uwu3 flex flex-col p-3 bg-white h-full">
      <div className="bg-white rounded-lg">
        <div className="p-5">
          <Asignacion
            asignacion={asignacion}
            setAsignacion={setAsignacion}
            abonosAsignacion={abonosAsignacion}
            setAbonosAsignacion={setAbonosAsignacion}
            nuevoAbonoAsignacion={nuevoAbonoAsignacion}
            setNuevoAbonoAsignacion={setNuevoAbonoAsignacion}
          />
          <ManoObra manoObra={manoObra} setManoObra={setManoObra} />

          <TablaRendicion
            items={items}
            handleChange={handleChange}
            agregarFila={agregarFila}
            editItem={editItem}
            deleteItem={deleteItem}
          />

          <div className="flex justify-end mt-4">
            <button
              onClick={agregarFila}
              className="px-4 py-2 text-white bg-red-800 rounded hover:bg-red-700"
            >
              Agregar Fila
            </button>
          </div>

          <div className="flex flex-col bg-white p-5 mt-10 rounded-lg shadow-md space-y-3">
  <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Resumen</h4>
  <div className="flex flex-col space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700">Total de Rendición:</span>
      <p className="text-sm text-gray-600 font-semibold">
        {totalRendicion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
      </p>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700">Saldo Actual de Asignación:</span>
      <p className="text-sm text-gray-600 font-semibold">
        {saldoActualAsignacion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
      </p>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700">Saldo Final de Asignación:</span>
      <p className="text-sm text-gray-600 font-semibold">
        {saldoFinalAsignacion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
      </p>
    </div>
  </div>
</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Rendicion;
  