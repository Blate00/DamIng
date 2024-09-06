import React, { useEffect, useState } from 'react';

// Función para formatear números en formato CLP
const formatCLP = (value) => {
  if (!value) return '';
  const numericValue = value.toString().replace(/\./g, '').replace(/,/g, '.');
  const [integer, fraction] = numericValue.split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return fraction ? `${formattedInteger},${fraction}` : formattedInteger;
};

const RegistroPagos = () => {
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    // Recuperar los datos del localStorage
    const pagosData = JSON.parse(localStorage.getItem('pagos')) || [];
    setPagos(pagosData);
  }, []);

  return (
    <div className="rounded-lg">
      <table className="min-w-full rounded-lg shadow-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 text-center">Trabajador</th>
            <th className="py-2 px-4 text-center">Fecha</th>
            <th className="py-2 px-4 text-center">Pago Día</th>
            <th className="py-2 px-4 text-center">Colación</th>
            <th className="py-2 px-4 text-center">Gestión</th>
            <th className="py-2 px-4 text-center">Extra</th>
            <th className="py-2 px-4 text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago, index) => (
            <tr key={index} className="border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-4 text-center">{pago.trabajadorNombre}</td>
              <td className="py-2 px-4 text-center">{pago.fecha}</td>
              <td className="py-2 px-4 text-center">{formatCLP(pago.pagoDia)}</td>
              <td className="py-2 px-4 text-center">{formatCLP(pago.colacion)}</td>
              <td className="py-2 px-4 text-center">{formatCLP(pago.gestion)}</td>
              <td className="py-2 px-4 text-center">{formatCLP(pago.extra)}</td>
              <td className="py-2 px-4 text-center">{formatCLP(pago.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistroPagos;
