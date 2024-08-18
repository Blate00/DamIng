import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'; // Iconos para la flecha

const Asignacion = ({
  asignacion,
  setAsignacion,
  abonosAsignacion,
  setAbonosAsignacion,
  nuevoAbonoAsignacion,
  setNuevoAbonoAsignacion,
  handleGuardarAsignacion,
}) => {
  const [desplegado, setDesplegado] = useState(false); // Estado para manejar la visibilidad del contenido
  const [tipoTransaccion, setTipoTransaccion] = useState('Transferencia'); // Estado para el tipo de transacción

  const totalRecibidoAsignacion = abonosAsignacion.reduce((total, abono) => total + abono.monto, 0);
  const saldoActual = asignacion - totalRecibidoAsignacion;

  const obtenerFechaActual = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };

  const handleGuardarAbono = () => {
    const nuevoAbono = {
      fecha: obtenerFechaActual(),
      tipoTransaccion,
      monto: nuevoAbonoAsignacion,
    };

    // Aquí se asegura que el tipoTransaccion se pase correctamente
    setAbonosAsignacion([...abonosAsignacion, nuevoAbono]);
    setNuevoAbonoAsignacion(0); // Resetear el campo de nuevo abono
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setDesplegado(!desplegado)}>
        <h4 className="text-center font-bold mb-4">Resumen Dineros Recibidos Asignación</h4>
        {desplegado ? (
          <ChevronUpIcon className="w-6 h-6 text-gray-700" />
        ) : (
          <ChevronDownIcon className="w-6 h-6 text-gray-700" />
        )}
      </div>

      {desplegado && (
        <>
        

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tipo de Transacción</label>
            <select
              value={tipoTransaccion}
              onChange={(e) => setTipoTransaccion(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full"
            >
              <option value="Transferencia">Transferencia</option>
              <option value="Efectivo">Efectivo</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nuevo Abono para Asignación</label>
            <input
              type="number"
              value={nuevoAbonoAsignacion}
              onChange={(e) => setNuevoAbonoAsignacion(parseFloat(e.target.value) || 0)}
              className="mt-1 p-2 border rounded-md w-full"
            />
            <button
              onClick={handleGuardarAbono}
              className="mt-2 p-2 bg-red-800 text-white rounded-md hover:bg-red-900"
            >
              Guardar Abono de Asignación
            </button>
          </div>

          <table className="min-w-full bg-white border border-black">
            <thead>
              <tr>
                <th className="border border-black p-2 text-left">Fecha</th>
                <th className="border border-black p-2 text-left">Tipo de transacción</th>
                <th className="border border-black p-2 text-right">Ingreso</th>
              </tr>
            </thead>
            <tbody>
              {abonosAsignacion.map((abono, index) => (
                <tr key={index}>
                  <td className="border border-black p-2">{abono.fecha}</td>
                  <td className="border border-black p-2">{abono.tipoTransaccion}</td>
                  <td className="border border-black p-2 text-right">
                    {abono.monto.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="border border-black p-2 font-bold text-left">Total Recibido</td>
                <td className="border border-black p-2 text-right">
                  {totalRecibidoAsignacion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </td>
              </tr>
             
              <tr>
                <td colSpan="2" className="border border-black p-2 font-bold text-left">Saldo Actual</td>
                <td className="border border-black p-2 text-right">
                {totalRecibidoAsignacion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Asignacion;
