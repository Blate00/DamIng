import React, { useState } from 'react';
import { useMaterials } from '../../../general/MaterialsContext';
import Breadcrumb from '../../../general/Breadcrumb'; 

const Pmaterial = () => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [discardedMaterials, setDiscardedMaterials] = useState([]);
  const [materials, setMaterials] = useMaterials();

  const groups = [...new Set(materials.map(material => material.group))];

  const toggleGroupSelection = (group) => {
    setSelectedGroups((prevSelectedGroups) =>
      prevSelectedGroups.includes(group)
        ? prevSelectedGroups.filter((g) => g !== group)
        : [...prevSelectedGroups, group]
    );
  };

  const handleDiscardMaterial = (index) => {
    const materialToDiscard = materials[index];
    setDiscardedMaterials([...discardedMaterials, materialToDiscard]);
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleRecoverMaterial = (index) => {
    const materialToRecover = discardedMaterials[index];
    setMaterials([...materials, materialToRecover]);
    setDiscardedMaterials(discardedMaterials.filter((_, i) => i !== index));
  };

  const filteredMaterials = selectedGroups.length > 0 
    ? materials.filter(material => selectedGroups.includes(material.group))
    : materials;

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white rounded-lg p-100">
        <div className="p-5"><Breadcrumb/>
          <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Lista de Materiales</h1>

          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Filtrar por Grupo</h2>
            <div className="grid grid-cols-5 gap-">
              {groups.map((group, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(group)}
                    onChange={() => toggleGroupSelection(group)}
                    className="form-checkbox h-5 w-5 text-red-600"
                  />
                  <span className="text-gray-700">{group}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <thead className='bg-red-800 border-b border-gray-200'>
                <tr className="text-gray-100 text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Grupo</th>
                  <th className="py-3 px-6 text-left">Descripción</th>
                  <th className="py-3 px-6 text-left">Valor</th>
                  <th className="py-3 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {filteredMaterials.map((material, index) => (
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
                        onClick={() => handleDiscardMaterial(index)}
                        className="text-white px-3 py-1 rounded-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-800">
                          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75 .75 0 0 0 0-1.5H9a.75 .75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {discardedMaterials.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Pmaterial;
