import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { DotsVerticalIcon } from '@heroicons/react/outline';

const RegistroPagos = () => {
  const location = useLocation();
  const trabajadorId = location.state?.trabajadorId;
  const [pagos, setPagos] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const pagosGuardados = JSON.parse(localStorage.getItem('pagos')) || [];
    const pagosFiltrados = pagosGuardados.find(p => p.trabajadorId === trabajadorId)?.pagos || [];
    setPagos(pagosFiltrados);
  }, [trabajadorId]);

  const handleDotsClick = (index) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const handleDeletePago = (index) => {
    const updatedPagos = pagos.filter((_, i) => i !== index);
    const pagosGuardados = JSON.parse(localStorage.getItem('pagos')) || [];
    const trabajadorIndex = pagosGuardados.findIndex(p => p.trabajadorId === trabajadorId);

    if (trabajadorIndex >= 0) {
      pagosGuardados[trabajadorIndex].pagos = updatedPagos;
      localStorage.setItem('pagos', JSON.stringify(pagosGuardados));
      setPagos(updatedPagos);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Registro de Pagos</h2>
      
      {pagos.length === 0 ? (
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 text-center text-gray-600">
          No hay pagos registrados para este trabajador.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">Día</th>
                <th className="px-4 py-2 text-left text-gray-600">Colación</th>
                <th className="px-4 py-2 text-left text-gray-600">Gestión</th>
                <th className="px-4 py-2 text-left text-gray-600">Extra</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-4 py-2 text-gray-800">Día {index + 1}</td>
                  <td className="px-4 py-2 text-gray-800">{pago.colacion}</td>
                  <td className="px-4 py-2 text-gray-800">{pago.gestion}</td>
                  <td className="px-4 py-2 text-gray-800">{pago.extra}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RegistroPagos;
