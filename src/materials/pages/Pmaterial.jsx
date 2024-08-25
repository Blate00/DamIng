import React, { useState } from 'react';
import { useMaterials } from '../../general/MaterialsContext';

const Pmaterial = () => {
  const [newMaterial, setNewMaterial] = useState({ group: '', description: '', value: 0 });
  const [editMaterial, setEditMaterial] = useState(null);
  const [materials, setMaterials] = useMaterials();

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

  return (
    <div className="flex flex-col p-3">
      <div className="bg-white rounded-lg p-4 100">
        <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Gestión de Materiales</h1>

        <div className="p-4 rounded-md  mb-4 sm:mb-4">
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
                editMaterial ? 'bg-red-900 hover:bg-blue-600' : 'bg-red-800 hover:bg-red-900'
              } text-white px-4 py-2 rounded-md transition duration-200`}
            >
              {editMaterial ? 'Guardar Cambios' : 'Añadir Material'}
            </button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Lista de Materiales</h2>
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
                      onClick={() => setEditMaterial({ ...material, index })}
                      className="bg-red-900 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteMaterial(index)}
                      className="bg-red-800 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pmaterial;
