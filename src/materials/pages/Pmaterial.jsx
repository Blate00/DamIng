import React, { useState } from 'react';
import { useMaterials } from '../../general/MaterialsContext';
import Breadcrumb from '../../general/Breadcrumb'; 

const Pmaterial = () => {
  const [newMaterial, setNewMaterial] = useState({ group: '', description: '', value: 0 });
  const [editMaterial, setEditMaterial] = useState(null);
  const [materials, setMaterials] = useMaterials();
  const [filterGroup, setFilterGroup] = useState('');

  const groups = [...new Set(materials.map(material => material.group))];

  const handleAddMaterial = () => {
    if (!newMaterial.group || !newMaterial.description || newMaterial.value <= 0) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    setMaterials([...materials, newMaterial]);
    setNewMaterial({ group: '', description: '', value: 0 });
  };

  const handleEditMaterial = (index) => {
    if (!editMaterial.group || !editMaterial.description || editMaterial.value <= 0) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    const updatedMaterials = materials.map((material, i) =>
      i === index ? editMaterial : material
    );
    setMaterials(updatedMaterials);
    setEditMaterial(null);
  };

  const handleDeleteMaterial = (index) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este material?");
    if (confirmed) {
      setMaterials(materials.filter((_, i) => i !== index));
    }
  };

  const filteredMaterials = filterGroup ? 
    materials.filter(material => material.group === filterGroup) :
    materials;

  return (
    <div className=" flex flex-col p-3 bg-white h-full">
          

      <div className="bg-white rounded-lg p-100">  
       
        <div className="p-5"> <Breadcrumb />
          <h1 className="text-2xl font-bold mb-1 text-center md:text-left">Gestión de Materiales</h1>

          <div className="p-4 rounded-md mb-4 sm:mb-4">
            <h2 className="text-lg font-semibold mb-2">{editMaterial ? "Editar Material" : "Añadir Material"}</h2>
            <div className="grid grid-cols-4 gap-4">
              <select
                value={editMaterial ? editMaterial.group : newMaterial.group}
                onChange={(e) =>
                  editMaterial
                    ? setEditMaterial({ ...editMaterial, group: e.target.value })
                    : setNewMaterial({ ...newMaterial, group: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-900"
              >
                <option value="">Seleccionar Grupo</option>
                {groups.map((group, index) => (
                  <option key={index} value={group}>{group}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Descripción"
                value={editMaterial ? editMaterial.description : newMaterial.description}
                onChange={(e) =>
                  editMaterial
                    ? setEditMaterial({ ...editMaterial, description: e.target.value })
                    : setNewMaterial({ ...newMaterial, description: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="number"
                placeholder="Valor"
                value={editMaterial ? editMaterial.value : newMaterial.value}
                onChange={(e) =>
                  editMaterial
                    ? setEditMaterial({ ...editMaterial, value: Number(e.target.value) })
                    : setNewMaterial({ ...newMaterial, value: Number(e.target.value) })
                }
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={editMaterial ? () => handleEditMaterial(editMaterial.index) : handleAddMaterial}
                className={`${
                  editMaterial ? 'bg-red-900 hover:bg-red-800' : 'bg-red-800 hover:bg-red-900'
                } text-white px-4 py-2 rounded-md transition duration-200`}
              >
                {editMaterial ? 'Guardar Cambios' : 'Añadir Material'}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Filtrar por Grupo</h2>
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Mostrar Todos</option>
              {groups.map((group, index) => (
                <option key={index} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <h2 className="text-xl font-semibold mb-4">Lista de Materiales</h2>
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-gray-500 text-sm leading-normal">
                <th className="py-3 px-6 text-left">Item</th>
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
                        <span className="font-medium">{material.item}</span>
                      </div>
                    </td>
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
                        onClick={() => setEditMaterial({ ...material, index })}
                        className="text-white px-3 py-1 rounded-md mr-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-800">
                          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                          <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(index)}
                        className="text-white px-3 py-1 rounded-md"
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
      </div>
    </div>
  );
};

export default Pmaterial;
