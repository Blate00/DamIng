import React, { useState, useEffect } from 'react';
import EgresosTrabajadores from '../components/EgresosTrabajadores';

const Empresa = () => {
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);

  useEffect(() => {
    const totalRecibido = parseFloat(localStorage.getItem('totalRecibido')) || 0;
    setIngresos(totalRecibido - egresos);
  }, [egresos]);

  const handleEgreso = (monto) => {
    setEgresos(prevEgresos => prevEgresos + monto);
  };

  return (
    <div className="container mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Gestión de la Empresa</h2>

      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-700">Ingresos Totales</h5>
        <p className="text-sm text-gray-600">
          {ingresos.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
        </p>
      </div>

      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-700">Egresos Totales</h5>
        <p className="text-sm text-gray-600">
          {egresos.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
        </p>
      </div>

      <EgresosTrabajadores handleEgreso={handleEgreso} />

      <button
        onClick={() => handleEgreso(50000)} // Ejemplo de egreso, cámbialo según sea necesario
        className="mt-4 p-2 bg-red-800 text-white rounded-md hover:bg-red-900"
      >
        Agregar Egreso
      </button>
    </div>
  );
};

export default Empresa;
