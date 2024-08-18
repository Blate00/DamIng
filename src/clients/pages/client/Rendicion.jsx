import React, { useState, useEffect } from 'react';
import Asignacion from './components/Asignacion';
import TablaRendicion from './components/TablaRendicion';

const RendicionFondos = () => {
  const [asignacion, setAsignacion] = useState(0);
  const [abonosAsignacion, setAbonosAsignacion] = useState([]);
  const [nuevoAbonoAsignacion, setNuevoAbonoAsignacion] = useState(0);

  const [items, setItems] = useState([
    { fecha: '', detalle: '', folio: '', proveedor: '', documento: '', total: '' },
  ]);

  const totalRecibidoAsignacion = abonosAsignacion.reduce((total, abono) => total + abono.monto, 0);

  useEffect(() => {
    const storedAsignacion = localStorage.getItem('asignacion');
    if (storedAsignacion) {
      setAsignacion(parseFloat(storedAsignacion) || 0);
    }
  }, []);

  const handleGuardarAsignacion = () => {
    localStorage.setItem('asignacion', asignacion);
  };

  const handleGuardarAbonoAsignacion = (fecha, tipoTransaccion, monto) => {
    const nuevoAbono = {
      fecha,
      tipoTransaccion,
      monto
    };
  
    setAbonosAsignacion([...abonosAsignacion, nuevoAbono]);
  };

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const agregarFila = () => {
    setItems([
      ...items,
      { fecha: '', detalle: '', folio: '', proveedor: '', documento: '', total: '' },
    ]);
  };

  const totalRendicion = items.reduce((total, item) => total + (parseFloat(item.total) || 0), 0);

  const saldoActualAsignacion = asignacion + totalRecibidoAsignacion;
  const saldoFinalAsignacion = saldoActualAsignacion - totalRendicion;

  return (
    <div className="flex flex-col p-3">
      <div className="uwu2 w-full rounded-lg p-5">
        <h2 className="text-2xl font-bold text-center mb-6 text-red-900">Rendición de Fondos</h2>

        <Asignacion
          asignacion={asignacion}
          setAsignacion={setAsignacion}
          abonosAsignacion={abonosAsignacion}
          setAbonosAsignacion={setAbonosAsignacion}
          nuevoAbonoAsignacion={nuevoAbonoAsignacion}
          setNuevoAbonoAsignacion={setNuevoAbonoAsignacion}
          handleGuardarAsignacion={handleGuardarAsignacion}
          handleGuardarAbonoAsignacion={handleGuardarAbonoAsignacion}
        />

        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Detalle de Rendición</h3>
        
        <TablaRendicion items={items} handleChange={handleChange} agregarFila={agregarFila} />
       
        <h4 className="text-lg font-bold text-gray-800 mt-8 mb-4">Resumen</h4>
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-700">Total de Rendición</h5>
          <p className="text-sm text-gray-600">
            {totalRendicion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
          </p>
        </div>
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-700">Saldo Actual de Asignación</h5>
          <p className="text-sm text-gray-600">
            {saldoActualAsignacion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
          </p>
        </div>
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-700">Saldo Final de Asignación</h5>
          <p className="text-sm text-gray-600">
            {saldoFinalAsignacion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RendicionFondos;
