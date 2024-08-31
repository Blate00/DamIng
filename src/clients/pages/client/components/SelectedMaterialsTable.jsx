import React from 'react';

const SelectedMaterialsTable = ({ selectedMaterials, handleRemoveMaterial, handleUpdateQuantity }) => (
  <div>
    <div className="overflow-x-auto rounded-lg">
      <table className="w-full border border-collapse">
        <thead>
          <tr className="text-gray-800 text-sm leading-normal">
            <th className="py-3 px-6 text-left">Grupo</th>
            <th className="py-3 px-6 text-left">Descripción</th>
            <th className="py-3 px-6 text-left">Cantidad</th>
            <th className="py-3 px-6 text-left">Valor</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {selectedMaterials.map((material, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex items-center">
                  <span className="font-medium">{material.group}</span>
                </div>
              </td>
              <td className="py-3 px-6 text-left">
                <div className="flex items-center">
                  <span>{material.description}</span>
                </div>
              </td>
              <td className="py-3 px-6 text-left">
                <div className="flex items-center">
                  <button onClick={() => handleUpdateQuantity(index, -1)} className="px-2 py-1 text-gray-800 border rounded">-</button>
                  <span className="mx-2">{material.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(index, 1)} className="px-2 py-1 text-gray-800 border rounded">+</button>
                </div>
              </td>
              <td className="py-3 px-6 text-left">
                <div className="flex items-center">
                  <span>${material.value}</span>
                </div>
              </td>
              <td className="py-3 px-6 text-center">
              <button
                  onClick={() => deleteItem(index)}
                  className="px-3 py-1 text-white "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-800">
                          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
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
