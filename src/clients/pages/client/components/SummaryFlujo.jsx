import React from 'react';

const SummaryFlujo = ({ total, formatCLP }) => {
  return (
    <div className="bg-gray-100 border border-r-l-b rounded-b-lg shadow-xl p-5 space-y-4">
      <div className="space-y-3">
       
      
       
        <div className="flex justify-between items-center ">
          <span className="text-base font-medium text-gray-700">Subtotal:</span>
          <p className="text-base text-red-700 font-bold">{formatCLP(total)}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryFlujo;