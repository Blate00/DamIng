import React, { useState, useEffect } from 'react';
import Asignacion from './components/Asignacion';
import ManoObra from './components/ManoObra';
import TablaRendicion from './components/TablaRendicion';

const RendicionFondos = () => {
  const [asignacion, setAsignacion] = useState(0);
  const [abonosAsignacion, setAbonosAsignacion] = useState([]);
  const [fechaAsignacion, setFechaAsignacion] = useState('');
  const [nuevoAbonoAsignacion, setNuevoAbonoAsignacion] = useState(0);
  const [fechaNuevoAbonoAsignacion, setFechaNuevoAbonoAsignacion] = useState('');

  const [manoObra, setManoObra] = useState(0);
  const [abonosManoObra, setAbonosManoObra] = useState([]);
  const [nuevoAbonoManoObra, setNuevoAbonoManoObra] = useState(0);
  const [fechaNuevoAbonoManoObra, setFechaNuevoAbonoManoObra] = useState('');

  const [items, setItems] = useState([
    { fecha: '', detalle: '', folio: '', proveedor: '', documento: '', total: '' },
  ]);

  useEffect(() => {
    // Carga el monto de asignación y mano de obra desde localStorage al montar el componente
    const storedAsignacion = localStorage.getItem('asignacion');
    if (storedAsignacion) {
      setAsignacion(parseFloat(storedAsignacion) || 0);
    }

    const storedManoObra = localStorage.getItem('manoObra');
    if (storedManoObra) {
      setManoObra(parseFloat(storedManoObra) || 0);
    }
  }, []);

  const handleGuardarAsignacion = () => {
    localStorage.setItem('asignacion', asignacion);
  };

  const handleGuardarAbonoAsignacion = () => {
    const nuevoAbono = { monto: nuevoAbonoAsignacion, fecha: fechaNuevoAbonoAsignacion };
    setAbonosAsignacion([...abonosAsignacion, nuevoAbono]);
    setNuevoAbonoAsignacion(0);
    setFechaNuevoAbonoAsignacion('');
  };

  const handleGuardarAbonoManoObra = () => {
    const nuevoAbono = { monto: nuevoAbonoManoObra, fecha: fechaNuevoAbonoManoObra };
    setAbonosManoObra([...abonosManoObra, nuevoAbono]);
    setNuevoAbonoManoObra(0);
    setFechaNuevoAbonoManoObra('');
  };

  const handleGuardarManoObra = () => {
    localStorage.setItem('manoObra', manoObra);
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

  // Calcula el total de rendición
  const totalRendicion = items.reduce((total, item) => total + parseFloat(item.total) || 0, 0);
  // Calcula el saldo actual de la asignación incluyendo los abonos
  const saldoActualAsignacion = asignacion + abonosAsignacion.reduce((total, abono) => total + abono.monto, 0);
  // Calcula el saldo final de la asignación después de restar la rendición
  const saldoFinalAsignacion = saldoActualAsignacion - totalRendicion;

  return (
    <div className="container mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-red-900">Rendición de Fondos</h2>

      <Asignacion
        asignacion={asignacion}
        setAsignacion={setAsignacion}
        abonosAsignacion={abonosAsignacion}
        fechaAsignacion={fechaAsignacion}
        setFechaAsignacion={setFechaAsignacion}
        nuevoAbonoAsignacion={nuevoAbonoAsignacion}
        setNuevoAbonoAsignacion={setNuevoAbonoAsignacion}
        fechaNuevoAbonoAsignacion={fechaNuevoAbonoAsignacion}
        setFechaNuevoAbonoAsignacion={setFechaNuevoAbonoAsignacion}
        handleGuardarAbonoAsignacion={handleGuardarAbonoAsignacion}
        handleGuardarAsignacion={handleGuardarAsignacion}
      />
      <ManoObra
        manoObra={manoObra}
        setManoObra={setManoObra}
        abonosManoObra={abonosManoObra}
        nuevoAbonoManoObra={nuevoAbonoManoObra}
        setNuevoAbonoManoObra={setNuevoAbonoManoObra}
        fechaNuevoAbonoManoObra={fechaNuevoAbonoManoObra}
        setFechaNuevoAbonoManoObra={setFechaNuevoAbonoManoObra}
        handleGuardarAbonoManoObra={handleGuardarAbonoManoObra}
        handleGuardarManoObra={handleGuardarManoObra}
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
  );
};

export default RendicionFondos;
