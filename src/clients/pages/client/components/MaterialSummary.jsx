import React from 'react';

const formatCLP = (value) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(value);
};

const MaterialSummary = ({ selectedMaterials }) => {
  const total = selectedMaterials.reduce((sum, material) => {
    const value = parseFloat(material.current_value) || 0;
    const quantity = parseFloat(material.quantity) || 0;
    return sum + value * quantity;
  }, 0);

  const totalItems = selectedMaterials.reduce((count, material) => {
    const quantity = parseFloat(material.quantity) || 0;
    return count + quantity;
  }, 0);

  return (
    <div className="flex flex-col border-r border-l border-b border-gray-300 bg-gray-100 p-6 mb- rounded-b-lg shadow-lg space-y-4 ">
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-800">Total:</span>
          <p className="text-lg text-black font-bold">{formatCLP(total)}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-800">Cantidad de Materiales:</span>
          <p className="text-lg text-black font-bold">{totalItems}</p>
        </div>
      </div>
    </div>
  );
};

export default MaterialSummary;