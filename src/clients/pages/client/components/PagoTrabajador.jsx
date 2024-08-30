import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import Breadcrumb from '../../../../general/Breadcrumb'; 

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
    <div className=" flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg"><div className="p-5">
        <Breadcrumb/>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Rendición de {trabajador.nombre}</h2>
      {pagos.map((pago, index) => (
        <div key={index} className="mb-2">
          <div
            className="flex items-center justify-between cursor-pointer p-3 bg-white rounded-lg shadow-sm border border-gray-200"
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
            <div className="mt- p-4 bg-white    grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <input
                  type="number"
                  value={pago.dia}
                  placeholder='Pago Día'
                  onChange={(e) => handleInputChange(index, 'dia', e.target.value)}
                  className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={pago.colacion}
                  placeholder='Colación'
                  onChange={(e) => handleInputChange(index, 'colacion', e.target.value)}
                  className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={pago.gestion}
                  placeholder='Gestión'
                  onChange={(e) => handleInputChange(index, 'gestion', e.target.value)}
                  className="p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={pago.extra}
                  placeholder='Extra'
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
    </div></div></div>
  );
};

export default PagoTrabajador;
