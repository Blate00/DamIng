import React from 'react';

const formatCLP = (value) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(value);
};

const SelectedMaterialsTable = ({ selectedMaterials, handleRemoveMaterial, handleUpdateQuantity }) => (
  <div>
  <div className="overflow-x-auto rounded-t-lg border border-r-l bg-white shadow-xl">
    <table className="min-w-full">
      <thead className="bg-red-800">
        <tr>
          <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Categoría</th>
          <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Descripción</th>
          <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Cantidad</th>
          <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Valor Unitario</th>
          <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Valor Total</th>
          <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {selectedMaterials.map((material, index) => (
          <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
            <td className="py-4 px-6 text-center">
              <span className="font-medium text-gray-700">{material.category}</span>
            </td>
            <td className="py-4 px-6 text-center">
              <span className="text-gray-700">{material.description}</span>
            </td>
            <td className="py-4 px-6 text-center">
              <div className="flex items-center justify-center space-x-2">
                <button 
                  onClick={() => handleUpdateQuantity(index, -1)} 
                  className="text-red-600 hover:text-red-800 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="font-medium text-gray-700">{material.quantity}</span>
                <button 
                  onClick={() => handleUpdateQuantity(index, 1)} 
                  className="text-red-600 hover:text-red-800 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </td>
            <td className="py-4 px-6 text-center">
              <span className="text-gray-700">{formatCLP(material.current_value)}</span>
            </td>
            <td className="py-4 px-6 text-center">
              <span className="font-medium text-gray-700">{formatCLP(material.current_value * material.quantity)}</span>
            </td>
            <td className="py-4 px-6 text-center">
              <button onClick={() => handleRemoveMaterial(index)} className="text-red-600 hover:text-red-800 transition-colors duration-200 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
);

export default SelectedMaterialsTable;