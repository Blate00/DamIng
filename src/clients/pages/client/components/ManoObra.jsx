import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

const ManoObra = ({
  manoObra,
  setManoObra,
  handleGuardarManoObra,
}) => {
  const [desplegado, setDesplegado] = useState(false);
  const [tipoTransaccion, setTipoTransaccion] = useState('Transferencia');
  const [abonosManoObra, setAbonosManoObra] = useState(JSON.parse(localStorage.getItem('abonosManoObra')) || []);
  const [nuevoAbonoManoObra, setNuevoAbonoManoObra] = useState(0);

  // Obtener netTotal desde localStorage y usarlo como valor inicial de manoObra
  useEffect(() => {
    const netTotal = parseFloat(localStorage.getItem('netTotal')) || 0;
    setManoObra(netTotal);
  }, [setManoObra]);

  useEffect(() => {
    localStorage.setItem('abonosManoObra', JSON.stringify(abonosManoObra));
    localStorage.setItem('totalRecibido', abonosManoObra.reduce((total, abono) => total + abono.monto, 0));
  }, [abonosManoObra]);

  const totalRecibido = abonosManoObra.reduce((total, abono) => total + abono.monto, 0);
  const saldoActual = manoObra - totalRecibido;

  const obtenerFechaActual = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  const handleGuardarAbono = () => {
    const nuevoAbono = {
      fecha: obtenerFechaActual(),
      tipoTransaccion,
      monto: nuevoAbonoManoObra,
    };

    setAbonosManoObra([...abonosManoObra, nuevoAbono]);
    setNuevoAbonoManoObra(0);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setDesplegado(!desplegado)}>
        <h4 className="text-center font-bold mb-4">Resumen Mano de Obra</h4>
        {desplegado ? (
          <ChevronUpIcon className="w-6 h-6 text-gray-700" />
        ) : (
          <ChevronDownIcon className="w-6 h-6 text-gray-700" />
        )}
      </div>

      {desplegado && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Total de Mano de Obra</label>
            <input
              type="number"
              value={manoObra}
              onChange={(e) => setManoObra(parseFloat(e.target.value) || 0)}
              className="mt-1 p-2 border rounded-md w-full"
            />
            <button
              onClick={handleGuardarManoObra}
              className="mt-2 p-2 bg-red-800 text-white rounded-md hover:bg-red-900"
            >
              Guardar Mano de Obra
            </button>
          </div>

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
            <label className="block text-sm font-medium text-gray-700">Nuevo Abono para Mano de Obra</label>
            <input
              type="number"
              value={nuevoAbonoManoObra}
              onChange={(e) => setNuevoAbonoManoObra(parseFloat(e.target.value) || 0)}
              className="mt-1 p-2 border rounded-md w-full"
            />
            <button
              onClick={handleGuardarAbono}
              className="mt-2 p-2 bg-red-800 text-white rounded-md hover:bg-red-900"
            >
              Guardar Abono de Mano de Obra
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
              {abonosManoObra.map((abono, index) => (
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
                  {totalRecibido.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="border border-black p-2 font-bold text-left">Total Mano de Obra</td>
                <td className="border border-black p-2 text-right">
                  {manoObra.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="border border-black p-2 font-bold text-left">Saldo Actual</td>
                <td className="border border-black p-2 text-right">
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

export default ManoObra;
