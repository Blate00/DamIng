import React from 'react';

const Asignacion = ({
  asignacion,
  setAsignacion,
  abonosAsignacion,
  fechaAsignacion,
  setFechaAsignacion,
  nuevoAbonoAsignacion,
  setNuevoAbonoAsignacion,
  fechaNuevoAbonoAsignacion,
  setFechaNuevoAbonoAsignacion,
  handleGuardarAbonoAsignacion,
  handleGuardarAsignacion, // Nueva prop
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Total de Asignación</label>
      <input
        type="number"
        value={asignacion}
        onChange={(e) => setAsignacion(parseFloat(e.target.value) || 0)}
        className="mt-1 p-2 border rounded-md w-full"
      />
      <button
        onClick={handleGuardarAsignacion}
        className="mt-2 p-2 bg-red-800 text-white rounded-md hover:bg-red-900"
      >
        Guardar Asignación
      </button>

      <div className="mb-4 mt-4">
        <label className="block text-sm font-medium text-gray-700">Nuevo Abono para Asignación</label>
        <input
          type="number"
          value={nuevoAbonoAsignacion}
          onChange={(e) => setNuevoAbonoAsignacion(parseFloat(e.target.value) || 0)}
          className="mt-1 p-2 border rounded-md w-full"
        />
        <label className="block text-sm font-medium text-gray-700 mt-2">Fecha del Abono</label>
        <input
          type="date"
          value={fechaNuevoAbonoAsignacion}
          onChange={(e) => setFechaNuevoAbonoAsignacion(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
        <button
          onClick={handleGuardarAbonoAsignacion}
          className="mt-2 p-2 bg-red-800 text-white rounded-md hover:bg-red-900"
        >
          Guardar Abono de Asignación
        </button>
      </div>

      <h5 className="text-sm font-medium text-gray-700 mt-4">Abonos a la Asignación</h5>
      <ul className="list-disc list-inside">
        {abonosAsignacion.map((abono, index) => (
          <li key={index} className="text-sm text-gray-600">
            Monto: {abono.monto.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })} - Fecha: {abono.fecha}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Asignacion;
