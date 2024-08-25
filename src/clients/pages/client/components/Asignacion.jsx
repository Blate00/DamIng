import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

const Asignacion = ({
  asignacion,
  setAsignacion,
  abonosAsignacion,
  setAbonosAsignacion,
  nuevoAbonoAsignacion,
  setNuevoAbonoAsignacion,
  handleGuardarAsignacion,
}) => {
  const [desplegado, setDesplegado] = useState(false);
  const [tipoTransaccion, setTipoTransaccion] = useState('Transferencia');

  const totalRecibidoAsignacion = abonosAsignacion.reduce((total, abono) => total + abono.monto, 0);
  const saldoActual = asignacion - totalRecibidoAsignacion;

  const obtenerFechaActual = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  const handleGuardarAbono = () => {
    const nuevoAbono = {
      fecha: obtenerFechaActual(),
      tipoTransaccion,
      monto: nuevoAbonoAsignacion,
    };

    setAbonosAsignacion([...abonosAsignacion, nuevoAbono]);
    setNuevoAbonoAsignacion(0);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setDesplegado(!desplegado)}>
        <h4 className="text-xl font-bold text-gray-800">Resumen Asignación</h4>
        {desplegado ? (
          <ChevronUpIcon className="w-6 h-6 text-gray-700" />
        ) : (
          <ChevronDownIcon className="w-6 h-6 text-gray-700" />
        )}
      </div>

      {desplegado && (
        <>
          <div className="mt-4 mb-6 flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-800">Total de Asignación</label>
              <input
                type="number"
                value={asignacion}
                onChange={(e) => setAsignacion(parseFloat(e.target.value) || 0)}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-white"
              />
            </div>
            <button
              onClick={handleGuardarAsignacion}
              className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Guardar Asignación
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-800">Tipo de Transacción</label>
            <select
              value={tipoTransaccion}
              onChange={(e) => setTipoTransaccion(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-white"
            >
              <option value="Transferencia">Transferencia</option>
              <option value="Efectivo">Efectivo</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-800">Nuevo Abono para Asignación</label>
            <input
              type="number"
              value={nuevoAbonoAsignacion}
              onChange={(e) => setNuevoAbonoAsignacion(parseFloat(e.target.value) || 0)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-white"
            />
            <button
              onClick={handleGuardarAbono}
              className="mt-2 px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Guardar Abono de Asignación
            </button>
          </div>

          <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md overflow-hidden">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="py-3 px-6 text-left text-gray-800">Fecha</th>
                <th className="py-3 px-6 text-left text-gray-800">Tipo de Transacción</th>
                <th className="py-3 px-6 text-right text-gray-800">Ingreso</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {abonosAsignacion.map((abono, index) => (
                <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}>
                  <td className="py-3 px-6">{abono.fecha}</td>
                  <td className="py-3 px-6">{abono.tipoTransaccion}</td>
                  <td className="py-3 px-6 text-right">
                    {abono.monto.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td colSpan="2" className="py-3 px-6 text-left">Total Recibido</td>
                <td className="py-3 px-6 text-right">
                  {totalRecibidoAsignacion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td colSpan="2" className="py-3 px-6 text-left">Total Asignación</td>
                <td className="py-3 px-6 text-right">
                  {asignacion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td colSpan="2" className="py-3 px-6 text-left">Saldo Actual</td>
                <td className="py-3 px-6 text-right">
                  {saldoActual.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
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
