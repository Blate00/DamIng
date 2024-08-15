import React, { useState } from 'react';
import EgresosTrabajadores from '../components/EgresosTrabajadores';

const Empresa = () => {
  const [ingresos, setIngresos] = useState(0);

  return (
    <div className="container mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Gestión de la Empresa</h2>

      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-700">Ingresos Totales</h5>
        <p className="text-sm text-gray-600">
          {ingresos.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
        </p>
      </div>

      <EgresosTrabajadores ingresos={ingresos} setIngresos={setIngresos} />
    </div>
  );
};

export default Empresa;
    