import React, { useState, useEffect } from 'react';

const Summary = ({ total, formatCLP, ggPercentage, gestionPercentage, ggValue, gestionValue, subtotal }) => {
  // Estados para los porcentajes y valores
  const [localGgPercentage, setLocalGgPercentage] = useState(ggPercentage);
  const [localGestionPercentage, setLocalGestionPercentage] = useState(gestionPercentage);

  useEffect(() => {
    // Cargar los valores de porcentaje desde localStorage al montar el componente
    const savedGgPercentage = parseFloat(localStorage.getItem('ggPercentage')) || ggPercentage;
    const savedGestionPercentage = parseFloat(localStorage.getItem('gestionPercentage')) || gestionPercentage;

    setLocalGgPercentage(savedGgPercentage);
    setLocalGestionPercentage(savedGestionPercentage);
  }, [ggPercentage, gestionPercentage]);

  const handleSave = () => {
    const dataToSave = {
      ggPercentage: localGgPercentage,
      gestionPercentage: localGestionPercentage,
      ggValue,
      gestionValue,
      subtotal,
    };
    localStorage.setItem('summaryData', JSON.stringify(dataToSave));
    alert('Datos del resumen guardados en el almacenamiento local.');
  };

  return (
    <div className="flex flex-col bg-white p-5 mb-10 shadow-md space-y-3">
      <div className="flex flex-col space-y-1">
        <div className="flex justify-end items-right ">
          <span className="text-sm font-medium px-2 text-gray-700">Total:</span>
          <p className="text-sm text-red-600 font-semibold">{formatCLP(total)}</p>
        </div>
        <div className="flex justify-end items-right">
          <span className="text-sm font-medium px-2 text-gray-700">GG (%):</span>
          <input
            type="number"
            value={localGgPercentage}
            onChange={(e) => setLocalGgPercentage(parseFloat(e.target.value) || 0)}
            className="w-16 px-2 py-1 border rounded"
            onBlur={handleSave}
          />
          <p className="text-sm text-red-600 font-semibold">{formatCLP(ggValue)}</p>
        </div>
        <div className="flex justify-end items-right">
          <span className="text-sm font-medium px-2 text-gray-700">Gestión (%):</span>
          <input
            type="number"
            value={localGestionPercentage}
            onChange={(e) => setLocalGestionPercentage(parseFloat(e.target.value) || 0)}
            className="w-16 px-2 py-1 border rounded"
            onBlur={handleSave}
          />
          <p className="text-sm text-red-600 font-semibold">{formatCLP(gestionValue)}</p>
        </div>
        <div className="flex justify-end items-right">
          <span className="text-sm font-medium px-2 text-gray-700">Subtotal:</span>
          <p className="text-sm text-red-600 font-semibold">{formatCLP(subtotal)}</p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
