import React, { useState } from 'react';

const EgresosTrabajadores = ({ handleEgreso }) => {
  const [montoEgreso, setMontoEgreso] = useState(0);

  const handleAgregarEgreso = () => {
    handleEgreso(montoEgreso);
    setMontoEgreso(0); // Resetear el campo de monto
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Nuevo Egreso</label>
      <input
        type="number"
        value={montoEgreso}
        onChange={(e) => setMontoEgreso(parseFloat(e.target.value) || 0)}
        className="mt-1 p-2 border rounded-md w-full"
      />
      <button
        onClick={handleAgregarEgreso}
        className="mt-2 p-2 bg-red-800 text-white rounded-md hover:bg-red-900"
      >
        Agregar Egreso
      </button>
    </div>
  );
};

export default EgresosTrabajadores;
