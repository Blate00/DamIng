import React from 'react';

const SummaryFlujo = ({ newTotal, registeredTotal, formatCLP }) => {
  const totalGeneral = newTotal + registeredTotal;

  console.log('Summary - Nuevos:', newTotal);
  console.log('Summary - Registrados:', registeredTotal);
  console.log('Summary - Total General:', totalGeneral);

  return (
    <div className="bg-gray-100 border border-r-l-b rounded-b-xl p-5 space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-gray-700">Pagos Nuevos:</span>
          <p className="text-base text-gray-600">{formatCLP(newTotal)}</p>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-gray-700">Pagos Registrados:</span>
          <p className="text-base text-gray-600">{formatCLP(registeredTotal)}</p>
        </div>

        <div className="border-t border-gray-300 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-700">Total General:</span>
            <p className="text-lg text-red-700 font-bold">{formatCLP(totalGeneral)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryFlujo;