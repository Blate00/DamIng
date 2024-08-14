import React, { useEffect } from 'react';

const ManoObra = ({
  manoObra,
  setManoObra,
  abonosManoObra,
  nuevoAbonoManoObra,
  setNuevoAbonoManoObra,
  fechaNuevoAbonoManoObra,
  setFechaNuevoAbonoManoObra,
  handleGuardarAbonoManoObra,
  handleGuardarManoObra, // Nueva función para guardar en localStorage
}) => {
  // Calcula el total de abonos
  const totalAbonos = abonosManoObra.reduce((total, abono) => total + abono.monto, 0);
  // Calcula el saldo actual
  const saldoActual = manoObra - totalAbonos;

  useEffect(() => {
    // Carga el monto de mano de obra desde localStorage al montar el componente
    const storedManoObra = localStorage.getItem('manoObra');
    if (storedManoObra) {
      setManoObra(parseFloat(storedManoObra) || 0);
    }
  }, [setManoObra]);

  const handleGuardarManoObraClick = () => {
    localStorage.setItem('manoObra', manoObra);
    handleGuardarManoObra(); // Llama a la función original
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Monto de Mano de Obra</label>
      <input
        type="number"
        value={manoObra}
        onChange={(e) => setManoObra(parseFloat(e.target.value) || 0)}
        className="mt-1 p-2 border rounded-md w-full"
      />
      <button
        onClick={handleGuardarManoObraClick}
        className="mt-2 p-2 bg-red-800 text-white rounded-md hover:bg-red-900"
      >
        Guardar Mano de Obra
      </button>

      <div className="mb-4 mt-4">
        <label className="block text-sm font-medium text-gray-700">Nuevo Abono para Mano de Obra</label>
        <input
          type="number"
          value={nuevoAbonoManoObra}
          onChange={(e) => setNuevoAbonoManoObra(parseFloat(e.target.value) || 0)}
          className="mt-1 p-2 border rounded-md w-full"
        />
        <label className="block text-sm font-medium text-gray-700 mt-2">Fecha del Abono</label>
        <input
          type="date"
          value={fechaNuevoAbonoManoObra}
          onChange={(e) => setFechaNuevoAbonoManoObra(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
        <button
          onClick={handleGuardarAbonoManoObra}
          className="mt-2 p-2 bg-red-800 text-white rounded-md hover:bg-red-900"
        >
          Guardar Abono de Mano de Obra
        </button>
      </div>

      <h5 className="text-sm font-medium text-gray-700 mt-4">Abonos a la Mano de Obra</h5>
      <ul className="list-disc list-inside">
        {abonosManoObra.map((abono, index) => (
          <li key={index} className="text-sm text-gray-600">
            Monto: {abono.monto.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })} - Fecha: {abono.fecha}
          </li>
        ))}
      </ul>

      <h5 className="text-sm font-medium text-gray-700 mt-4">Saldo Actual de la Mano de Obra</h5>
      <p className="text-sm text-gray-600">
        {saldoActual.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
      </p>
    </div>
  );
};

export default ManoObra;
