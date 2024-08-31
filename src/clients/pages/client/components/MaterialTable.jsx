import React from 'react';

const MaterialTable = ({ materials, handleAddMaterial }) => (
  <div className="overflow-x-auto rounded-lg">
    <table className="min-w-full bg-white shadow-md ">
      <thead className='bg-red-800 border-b border-gray-200'>
        <tr className="text-gray-100 text-sm leading-normal">
          <th className="py-3 px-6 text-left">Grupo</th>
          <th className="py-3 px-6 text-left">Descripción</th>
          <th className="py-3 px-6 text-left">Valor</th>
          <th className="py-3 px-6 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {materials.map((material, index) => (
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
                onClick={() => handleAddMaterial(index)}
                className="text-white px-3 py-1 rounded-md bg-green-800"
              >
                Añadir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default MaterialTable;
