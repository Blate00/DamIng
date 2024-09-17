import React from 'react';

const formatCLP = (value) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(value);
};

const SelectedMaterialsTable = ({ selectedMaterials, handleRemoveMaterial, handleUpdateQuantity }) => (
  <div>
    <div className="overflow-x-auto ">
      <table className="min-w-full bg-white border-r border-l border-gray-300 shadow-lg">
        <thead className='bg-gray-100'>
          <tr className="">
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Categoría</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Descripción</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Cantidad</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Valor Unitario</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Valor Total</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {selectedMaterials.map((material, index) => (
          <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
          <td className="py-4 px-6 text-center">

              <span className="font-medium text-gray-700">{material.category}</span>
   
          </td>
          <td className="py-4 px-6 text-center">
          
              <span className="text-gray-600">{material.description}</span>
           
          </td>
          <td className="py-4 px-6 text-center">
         
              <button 
                onClick={() => handleUpdateQuantity(index, -1)} 
                className="px-2 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                -
              </button>
              <span className="mx-2 font-medium text-gray-700">{material.quantity}</span>
              <button 
                onClick={() => handleUpdateQuantity(index, 1)} 
                className="px-2 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                +
              </button>
           
          </td>
          <td className="py-4 px-6 text-center">
              <span className="text-gray-600">{formatCLP(material.current_value)}</span>
        
          </td>
          <td className="py-4 px-6 text-center">
          
              <span className="font-medium text-gray-700">{formatCLP(material.current_value * material.quantity)}</span>

          </td>
          <td className="py-4 px-6 text-center">
            <button
              onClick={() => handleRemoveMaterial(index)}
              className=""
            >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
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