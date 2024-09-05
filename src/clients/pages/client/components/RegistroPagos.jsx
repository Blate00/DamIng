import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../../../../general/Breadcrumb';
import TrabajadorDetalle from './DetallesTrabajador'; // Asegúrate de que esta ruta es correcta

// Función para formatear números en formato CLP
const formatCLP = (value) => {
  if (!value) return '';
  const numericValue = value.toString().replace(/\./g, '').replace(/,/g, '.');
  const [integer, fraction] = numericValue.split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return fraction ? `${formattedInteger},${fraction}` : formattedInteger;
};

const RegistroPagos = () => {
  const location = useLocation();
  const trabajadorId = location.state?.trabajadorId;
  const [pagos, setPagos] = useState([]);
  
  useEffect(() => {
    const pagosGuardados = JSON.parse(localStorage.getItem('pagos')) || [];
    const pagosFiltrados = pagosGuardados.filter(p => p.trabajadorId === trabajadorId);
    setPagos(pagosFiltrados);
  }, [trabajadorId]);

  const calcularTotalHaberes = () => {
    return pagos.reduce((total, pago) => total + pago.total, 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  };

  return (
    <div className="flex flex-col bg-white h-full p-5">
      <div className='bg-white h-full rounded-lg'>
        <Breadcrumb />
        <h2 className="text-xl font-semibold text-gray-800">Registro de Pagos</h2>
        {pagos.length === 0 ? (
          <div className="p-5 bg-white rounded-lg shadow-md border border-gray-200 text-center text-gray-600">
            No hay pagos registrados para este trabajador.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <TrabajadorDetalle trabajadorId={trabajadorId} />
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-red-800 border-b border-gray-200">
                  <th className="px-4 py-2 text-center text-gray-100">Proyecto</th>
                  <th className="px-4 py-2 text-center text-gray-100">Fecha</th>
                  <th className="px-4 py-2 text-center text-gray-100">Pago Día</th>
                  <th className="px-4 py-2 text-center text-gray-100">Colación</th>
                  <th className="px-4 py-2 text-center text-gray-100">Gestión</th>
                  <th className="px-4 py-2 text-center text-gray-100">Extra</th>
                  <th className="px-4 py-2 text-center text-gray-100">Total</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-2 border text-center text-gray-800">Montale Luminarias</td>
                    <td className="px-4 py-2 border text-center text-gray-800">15 Agosto</td>
                    <td className="px-4 py-2 border text-center text-gray-800">{formatCLP(pago.pagoDia)}</td>
                    <td className="px-4 py-2 border text-center text-gray-800">{formatCLP(pago.colacion)}</td>
                    <td className="px-4 py-2 border text-center text-gray-800">{formatCLP(pago.gestion)}</td>
                    <td className="px-4 py-2 border text-center text-gray-800">{formatCLP(pago.extra)}</td>
                    <td className="px-4 py-2 border text-center text-gray-800">{formatCLP(pago.total)}</td>
                  </tr>
                ))}
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 text-gray-800"></td>
                  <td className="px-4 py-2 text-gray-800"></td>
                  <td className="px-4 py-2 text-gray-800"></td>
                  <td className="px-4 py-2 text-gray-800"></td>
                  <td className="px-4 py-2 text-gray-800"></td>
                  <td className="py-2 border text-center font-bold text-gray-800">TOTALES:</td>
                  <td className="px-4 py-2 border text-center text-gray-800">{calcularTotalHaberes()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistroPagos;
