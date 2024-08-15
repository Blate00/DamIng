import React, { useState } from 'react';
import { useMaterials } from '../../general/MaterialsContext';
import Sidebar from '../../general/Sidebar';
import Header from '../../general/Header';

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
    <div className="uwu p-3 flex h-screen">
    
        <div className="uwu2 p-5 w-full rounded-lg">
          <h1 className="text-2xl font-bold mb-6">Gestión de Materiales</h1>
          <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{editMaterial ? "Editar Material" : "Añadir Material"}</h2>
            <div className="space-y-4">
              <select
                value={editMaterial ? editMaterial.group : newMaterial.group}
                onChange={(e) =>
                  editMaterial
                    ? setEditMaterial({ ...editMaterial, group: e.target.value })
                    : setNewMaterial({ ...newMaterial, group: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-4">
                {editMaterial ? (
                  <>
                    <button
                      onClick={() => handleEditMaterial(editMaterial.index)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      onClick={() => setEditMaterial(null)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleAddMaterial}
                    className="bg-red-800 text-white px-4 py-2 rounded-md hover:bg-red-900"
                  >
                    Añadir
                  </button>
                )}
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-4">Lista de Materiales</h2>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-red-800 text-left">
                <tr>
                  <th className="px-6 py-3 text-white font-semibold">Grupo</th>
                  <th className="px-6 py-3 text-white font-semibold">Descripción</th>
                  <th className="px-6 py-3 text-white font-semibold">Valor</th>
                  <th className="px-6 py-3 text-white font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {materials.map((material, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-6 py-4 text-gray-700">{material.group}</td>
                    <td className="px-6 py-4 text-gray-700">{material.description}</td>
                    <td className="px-6 py-4 text-gray-700">${material.value}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <button
                        onClick={() => setEditMaterial({ ...material, index })}
                        className="bg-red-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600"
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
  