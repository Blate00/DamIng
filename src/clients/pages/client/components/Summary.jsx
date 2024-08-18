import React from 'react';

const Summary = ({ netTotal, ggPercentage, gestionPercentage, gg, gestion, totalGgGestion, totalNet, setGgPercentage, setGestionPercentage, formatCLP }) => (
  <div className="mt-4 text-right">
    <p className="text-sm md:text-lg text-gray-600">Neto <span className="font-bold">{formatCLP(netTotal)}</span></p>
    <p className="text-sm md:text-lg text-gray-600">
      GG (%)
      <input
        type="number"
        value={ggPercentage}
        onChange={(e) => setGgPercentage(e.target.value)}
        className="w-16 ml-2 border rounded p-1 text-xs md:text-base"
      />
      <span className="font-bold ml-2">{formatCLP(gg)}</span>
    </p>
    <p className="text-sm md:text-lg text-gray-600">
      Gestión (%)
      <input
        type="number"
        value={gestionPercentage}
        onChange={(e) => setGestionPercentage(e.target.value)}
        className="w-16 ml-2 border rounded p-1 text-xs md:text-base"
      />
      <span className="font-bold ml-2">{formatCLP(gestion)}</span>
    </p>
    <p className="text-sm md:text-lg text-gray-700">Total GG + Gestión <span className="font-bold">{formatCLP(totalGgGestion)}</span></p>
    <p className="text-sm md:text-lg text-gray-700">Total Neto <span className="font-bold">{formatCLP(totalNet)}</span></p>
  </div>
);

export default Summary;
