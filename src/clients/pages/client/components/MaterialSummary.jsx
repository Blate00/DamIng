import React from 'react';

// Asegúrate de importar formatCLP si está en otro archivo
// import { formatCLP } from 'ruta/del/archivo';

// Definir la función formatCLP si no está importada
const formatCLP = (value) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(value);
};

const MaterialSummary = ({ selectedMaterials }) => {
  // Calcular el total de materiales seleccionados
  const total = selectedMaterials.reduce((sum, material) => {
    const value = parseFloat(material.value) || 0;
    const quantity = parseFloat(material.quantity) || 0;
    return sum + value * quantity;
  }, 0);

  // Calcular la cantidad total de materiales
  const totalItems = selectedMaterials.reduce((count, material) => {
    const quantity = parseFloat(material.quantity) || 0;
    return count + quantity;
  }, 0);

  return (
    <div className="flex flex-col bg-white p-6 mb-10 ">
      <div className="flex flex-col space-y-1">
        <div className="flex justify-end items-right">
          <span className="text-sm font-medium px-2 text-gray-700">Total:</span>
          <p className="text-sm text-red-600 font-semibold">{formatCLP(total)}</p>
        </div>
        <div className="flex justify-end items-right">
          <span className="text-sm font-medium px-2 text-gray-700">Cantidad de Materiales:</span>
          <p className="text-sm text-red-600 font-semibold">{totalItems}</p>
        </div>
      </div>
    </div>
  );
};

export default MaterialSummary;
