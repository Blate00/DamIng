import React from 'react';

const DiscardedMaterialsTable = ({ discardedMaterials, handleRecoverMaterial }) => (
  <div className="mt-4">
    <h2 className="text-lg font-semibold mb-2">Materiales Descartados</h2>
    <div className="overflow-x-auto rounded-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-gray-500 text-sm leading-normal">
            <th className="py-3 px-6 text-left">Grupo</th>
            <th className="py-3 px-6 text-left">Descripción</th>
            <th className="py-3 px-6 text-left">Valor</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {discardedMaterials.map((material, index) => (
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
                  <span>${material.value}</span>
                </div>
              </td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => handleRecoverMaterial(index)}
                  className="text-white px-3 py-1 rounded-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-green-800">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-3 10.5a.75 .75 0 0 1 0-1.5h6a.75 .75 0 0 1 0 1.5H9Z" clipRule="evenodd" />
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

export default DiscardedMaterialsTable;
