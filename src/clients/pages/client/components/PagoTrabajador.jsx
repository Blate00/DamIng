import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

const PagoTrabajador = () => {
  const location = useLocation();
  const trabajador = location.state?.trabajador;
  const [desplegadoIndex, setDesplegadoIndex] = useState(null);

  if (!trabajador) {
    return <div className="p-4">Trabajador no encontrado</div>;
  }

  const [pagos, setPagos] = useState(
    Array(5).fill({ dia: '', colacion: '', gestion: '', extra: '' })
  );

  const handleInputChange = (index, field, value) => {
    const updatedPagos = pagos.map((pago, i) =>
      i === index ? { ...pago, [field]: value } : pago
    );
    setPagos(updatedPagos);
  };

  const handleGuardarPago = () => {
    const pagosGuardados = JSON.parse(localStorage.getItem('pagos')) || [];
    const trabajadorIndex = pagosGuardados.findIndex(p => p.trabajador === trabajador.nombre);

    if (trabajadorIndex >= 0) {
      pagosGuardados[trabajadorIndex].pagos = pagos;
    } else {
      pagosGuardados.push({
        trabajador: trabajador.nombre,
        pagos: pagos
      });
    }

    localStorage.setItem('pagos', JSON.stringify(pagosGuardados));
    alert('Pagos guardados con éxito');
  };

  return (
    <div className="p-5 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Rendición de {trabajador.nombre}</h2>
      {pagos.map((pago, index) => (
        <div key={index} className="mb-6">
          <div
            className="flex items-center justify-between cursor-pointer p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            onClick={() => setDesplegadoIndex(desplegadoIndex === index ? null : index)}
          >
            <h3 className="text-lg font-semibold text-gray-800">Día {index + 1}</h3>
            {desplegadoIndex === index ? (
              <ChevronUpIcon className="w-6 h-6 text-gray-600" />
            ) : (
              <ChevronDownIcon className="w-6 h-6 text-gray-600" />
            )}
          </div>
          {desplegadoIndex === index && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Día (CLP)</label>
                <input
                  type="number"
                  value={pago.dia}
                  onChange={(e) => handleInputChange(index, 'dia', e.target.value)}
                  className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Colación (CLP)</label>
                <input
                  type="number"
                  value={pago.colacion}
                  onChange={(e) => handleInputChange(index, 'colacion', e.target.value)}
                  className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Gestión (CLP)</label>
                <input
                  type="number"
                  value={pago.gestion}
                  onChange={(e) => handleInputChange(index, 'gestion', e.target.value)}
                  className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Extra (CLP)</label>
                <input
                  type="number"
                  value={pago.extra}
                  onChange={(e) => handleInputChange(index, 'extra', e.target.value)}
                  className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={handleGuardarPago}
        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Guardar Pago
      </button>
    </div>
  );
};

export default PagoTrabajador;
