// Summary.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Summary = ({ total, formatCLP, budgetId, ggPercentage, setGgPercentage, gestionPercentage, setGestionPercentage }) => {
  const [ggValue, setGgValue] = useState(0);
  const [gestionValue, setGestionValue] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const calculateValues = () => {
      const gg = (total * ggPercentage) / 100;
      const gestion = (total * gestionPercentage) / 100;
      setGgValue(gg);
      setGestionValue(gestion);
      setSubtotal(total + gg + gestion);
    };

    calculateValues();
  }, [total, ggPercentage, gestionPercentage]);

  return (
    <div className="bg-gray-100 border border-r-l-b rounded-b-xl  p-5 space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-600">Total:</span>
          <p className="text-base text-red-700 font-semibold">{formatCLP(total)}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">GG (%):</span>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="number"
                value={ggPercentage}
                onChange={(e) => setGgPercentage(parseFloat(e.target.value) || 0)}
                className="w-16 px-2 py-1 text-sm bg-transparent border-b border-gray-300 focus:border-red-600 focus:outline-none transition-colors duration-300"
              />
              <span className="absolute right-1 top-1 text-xs text-gray-400">%</span>
            </div>
            <p className="text-sm text-gray-700 font-semibold">{formatCLP(ggValue)}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Gestión (%):</span>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="number"
                value={gestionPercentage}
                onChange={(e) => setGestionPercentage(parseFloat(e.target.value) || 0)}
                className="w-16 px-2 py-1 text-sm bg-transparent border-b border-gray-300 focus:border-red-600 focus:outline-none transition-colors duration-300"
              />
              <span className="absolute right-1 top-1 text-xs text-gray-400">%</span>
            </div>
            <p className="text-sm text-gray-700 font-semibold">{formatCLP(gestionValue)}</p>
          </div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-base font-medium text-gray-700">Subtotal:</span>
          <p className="text-base text-red-700 font-bold">{formatCLP(subtotal)}</p>
        </div>
      </div>
    </div>
  );
};

export default Summary;