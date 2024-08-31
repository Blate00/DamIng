import React, { useState, useEffect } from 'react';

const Summary = ({ total, formatCLP }) => {
  // Estados para los porcentajes y valores
  const [ggPercentage, setGgPercentage] = useState(0);
  const [gestionPercentage, setGestionPercentage] = useState(0);
  const [ggValue, setGgValue] = useState(0);
  const [gestionValue, setGestionValue] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  // Actualizar valores de GG, gestión y subtotal cuando cambian los porcentajes o el total
  useEffect(() => {
    const ggCalculated = (total * ggPercentage) / 100;
    const gestionCalculated = (total * gestionPercentage) / 100;
    const subtotalCalculated = total + ggCalculated + gestionCalculated;

    setGgValue(ggCalculated);
    setGestionValue(gestionCalculated);
    setSubtotal(subtotalCalculated);
  }, [total, ggPercentage, gestionPercentage]);

  // Función para guardar datos en localStorage
  const handleSave = () => {
    const dataToSave = {
      ggPercentage,
      gestionPercentage,
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
            value={ggPercentage}
            onChange={(e) => setGgPercentage(e.target.value)}
            className="w-16 px-2 py-1 border rounded"
          />
          <p className="text-sm text-red-600 font-semibold">{formatCLP(ggValue)}</p>
        </div>
        <div className="flex justify-end items-right">
          <span className="text-sm font-medium px-2 text-gray-700">Gestión (%):</span>
          <input
            type="number"
            value={gestionPercentage}
            onChange={(e) => setGestionPercentage(e.target.value)}
            className="w-16 px-2 py-1 border rounded"
          />
          <p className="text-sm text-red-600 font-semibold">{formatCLP(gestionValue)}</p>
        </div>
        <div className="flex justify-end items-right">
          <span className="text-sm font-medium px-2 text-gray-700">Subtotal:</span>
          <p className="text-sm text-red-600 font-semibold">{formatCLP(subtotal)}</p>
        </div>
      </div>
      {/* Botón para guardar datos en localStorage */}
      <div className="flex justify-end mt-4">

      </div>
    </div>
  );
};

export default Summary;
