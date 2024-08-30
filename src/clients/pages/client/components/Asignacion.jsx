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
      monto: nuevoAbonoAsignacion || 0, // Asegura que se guarde 0 si nuevoAbonoAsignacion es 0
    };

    setAbonosAsignacion([...abonosAsignacion, nuevoAbono]);
    setNuevoAbonoAsignacion('');
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between cursor-pointer p-3 bg-red-800 rounded-md shadow-md" onClick={() => setDesplegado(!desplegado)}>
        <h4 className="text-xl font-bold text-gray-100">Resumen Asignación</h4>
        {desplegado ? (
          <ChevronUpIcon className="w-6 h-6 text-gray-100" />
        ) : (
          <ChevronDownIcon className="w-6 h-6 text-gray-100" />
        )}
      </div>

      {desplegado && (
        <>
          <div className=" mt-3 grid grid-cols-3 gap-4">
            <select
              value={tipoTransaccion}
              onChange={(e) => setTipoTransaccion(e.target.value)}
              className="p-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="" disabled>Seleccione un tipo de transacción</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Efectivo">Efectivo</option>
            </select>

            <input
              type="number"
              value={nuevoAbonoAsignacion || ''}
              placeholder="Ingrese el monto del abono"
              onChange={(e) => setNuevoAbonoAsignacion(e.target.value ? parseFloat(e.target.value) : '')}
              className="p-2 border border-gray-300 rounded-md bg-white"
            />
            
            <button
              onClick={handleGuardarAbono}
              className="bg-red-800 text-white py-2 px-4 rounded-md hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
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
