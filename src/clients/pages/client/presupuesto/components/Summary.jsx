import React, { useState, useEffect } from 'react';

const Summary = ({ total, formatCLP, budgetId, ggPercentage, setGgPercentage, gestionPercentage, setGestionPercentage }) => {
  const [ggValue, setGgValue] = useState(0);
  const [gestionValue, setGestionValue] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const calculateValues = () => {
      const gg = (total * (ggPercentage || 0)) / 100;
      const gestion = (total * (gestionPercentage || 0)) / 100;
      setGgValue(gg);
      setGestionValue(gestion);
      setSubtotal(total + gg + gestion);
    };

    calculateValues();
  }, [total, ggPercentage, gestionPercentage]);

  const handleGgChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setGgPercentage(value === '' ? '' : Number(value));
    }
  };

  const handleGestionChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setGestionPercentage(value === '' ? '' : Number(value));
    }
  };

  return (
    <div className=" mx-auto p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base text-gray-500">Subtotal</span>
          <p className="text-base sm:text-lg font-medium text-gray-800">{formatCLP(total)}</p>
        </div>

        {/* Gastos Generales */}
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base text-gray-500">Gastos Generales</span>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                value={ggPercentage === 0 ? '' : ggPercentage}
                onChange={handleGgChange}
                onKeyDown={(e) => {
                  if (e.key === '.' || e.key === ',') {
                    e.preventDefault();
                  }
                }}
                className="w-16 px-2 py-1 text-sm sm:text-base text-gray-800 bg-transparent border-b border-gray-200 focus:border-gray-400 focus:outline-none transition-colors duration-200"
                placeholder="0"
              />
              <span className="absolute right-1 top-1 text-xs text-gray-400">%</span>
            </div>
            <p className="text-sm sm:text-base text-gray-800">{formatCLP(ggValue)}</p>
          </div>
        </div>

        {/* Gestión */}
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base text-gray-500">Gestión</span>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                value={gestionPercentage === 0 ? '' : gestionPercentage}
                onChange={handleGestionChange}
                onKeyDown={(e) => {
                  if (e.key === '.' || e.key === ',') {
                    e.preventDefault();
                  }
                }}
                className="w-16 px-2 py-1 text-sm sm:text-base text-gray-800 bg-transparent border-b border-gray-200 focus:border-gray-400 focus:outline-none transition-colors duration-200"
                placeholder="0"
              />
              <span className="absolute right-1 top-1 text-xs text-gray-400">%</span>
            </div>
            <p className="text-sm sm:text-base text-gray-800">{formatCLP(gestionValue)}</p>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100">
          <span className="text-base sm:text-lg font-medium text-gray-700">Total</span>
          <p className="text-base sm:text-lg font-semibold text-gray-900">{formatCLP(subtotal)}</p>
        </div>
      </div>
    </div>
  );
};

export default Summary;