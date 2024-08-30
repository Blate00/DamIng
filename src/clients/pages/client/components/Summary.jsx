import React from 'react';

const Summary = ({ netTotal, ggPercentage, gestionPercentage, gg, gestion, totalGgGestion, totalNet, setGgPercentage, setGestionPercentage, formatCLP }) => (
<div className="flex flex-col bg-white p-5  space-y-3">
  <div className="flex flex-col space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700">Neto:</span>
      <p className="text-sm text-gray-600 font-semibold">{formatCLP(netTotal)}</p>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700">GG (%):</span>
      <div className="flex items-center">
        <input
          type="number"
          value={ggPercentage}
          onChange={(e) => setGgPercentage(e.target.value)}
          className="w-16 ml-2 border rounded p-1 text-xs md:text-base"
        />
        <span className="text-sm text-gray-600 font-semibold ml-2">{formatCLP(gg)}</span>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700">Gestión (%):</span>
      <div className="flex items-center">
        <input
          type="number"
          value={gestionPercentage}
          onChange={(e) => setGestionPercentage(e.target.value)}
          className="w-16 ml-2 border rounded p-1 text-xs md:text-base"
        />
        <span className="text-sm text-gray-600 font-semibold ml-2">{formatCLP(gestion)}</span>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700">Total GG + Gestión:</span>
      <p className="text-sm text-gray-600 font-semibold">{formatCLP(totalGgGestion)}</p>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700">Total Neto:</span>
      <p className="text-sm text-gray-700 font-bold">{formatCLP(totalNet)}</p>
    </div>
  </div>
</div>

);

export default Summary;
