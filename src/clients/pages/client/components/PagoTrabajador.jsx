import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

const PagoTrabajador = () => {
  const location = useLocation();
  const trabajador = location.state?.trabajador;
  const [desplegado, setDesplegado] = useState(false);

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
    const nuevoPago = {
      trabajador: trabajador.nombre,
      pagos: pagos
    };
    pagosGuardados.push(nuevoPago);
    localStorage.setItem('pagos', JSON.stringify(pagosGuardados));

    alert('Pagos guardados con éxito');
  };

  return (
    <div className="uwu p-3">
      <div className="uwu2 flex flex-col p-5">
        <h2 className="text-lg font-semibold mb-4">Rendición {trabajador.nombre}</h2>
        {pagos.map((pago, index) => (
          <div key={index} className="mb-6">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setDesplegado(!desplegado)}>
              <h3 className="font-semibold mb-2">Día {index + 1}</h3>
              {desplegado ? (
                <ChevronUpIcon className="w-6 h-6 text-gray-700" />
              ) : (
                <ChevronDownIcon className="w-6 h-6 text-gray-700" />
              )}
            </div>
            {desplegado && (
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-700">Día (CLP)</label>
                  <input
                    type="number"
                    value={pago.dia}
                    onChange={(e) => handleInputChange(index, 'dia', e.target.value)}
                    className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Colación (CLP)</label>
                  <input
                    type="number"
                    value={pago.colacion}
                    onChange={(e) => handleInputChange(index, 'colacion', e.target.value)}
                    className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Gestión (CLP)</label>
                  <input
                    type="number"
                    value={pago.gestion}
                    onChange={(e) => handleInputChange(index, 'gestion', e.target.value)}
                    className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Extra (CLP)</label>
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
          className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Guardar Pago
        </button>
      </div>
    </div>
  );
};

export default PagoTrabajador;
