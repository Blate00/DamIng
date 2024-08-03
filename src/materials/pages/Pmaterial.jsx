// src/pages/Pmaterial.js
import React, { useState } from 'react';
import { useMaterials } from '../../general/MaterialsContext';

const Pmaterial = () => {
  const [newMaterial, setNewMaterial] = useState({ group: '', description: '', value: 0 });
  const [editMaterial, setEditMaterial] = useState(null); // Estado para el material en edición
  const [materials, setMaterials] = useMaterials();

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
    <div>
      <h1>Gestión de Materiales</h1>
      <div>
        <h2>{editMaterial ? "Editar Material" : "Añadir Material"}</h2>
        <input
          type="text"
          placeholder="Grupo"
          value={editMaterial ? editMaterial.group : newMaterial.group}
          onChange={(e) =>
            editMaterial
              ? setEditMaterial({ ...editMaterial, group: e.target.value })
              : setNewMaterial({ ...newMaterial, group: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Descripción"
          value={editMaterial ? editMaterial.description : newMaterial.description}
          onChange={(e) =>
            editMaterial
              ? setEditMaterial({ ...editMaterial, description: e.target.value })
              : setNewMaterial({ ...newMaterial, description: e.target.value })
          }
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
        />
        {editMaterial ? (
          <button onClick={() => handleEditMaterial(editMaterial.index)}>Guardar Cambios</button>
        ) : (
          <button onClick={handleAddMaterial}>Añadir</button>
        )}
        {editMaterial && <button onClick={() => setEditMaterial(null)}>Cancelar</button>}
      </div>

      <h2>Lista de Materiales</h2>
      <ul>
        {materials.map((material, index) => (
          <li key={index}>
            {editMaterial && editMaterial.index === index ? (
              <div>
                <input
                  type="text"
                  value={editMaterial.group}
                  onChange={(e) => setEditMaterial({ ...editMaterial, group: e.target.value })}
                />
                <input
                  type="text"
                  value={editMaterial.description}
                  onChange={(e) => setEditMaterial({ ...editMaterial, description: e.target.value })}
                />
                <input
                  type="number"
                  value={editMaterial.value}
                  onChange={(e) => setEditMaterial({ ...editMaterial, value: Number(e.target.value) })}
                />
                <button onClick={() => handleEditMaterial(index)}>Guardar</button>
                <button onClick={() => setEditMaterial(null)}>Cancelar</button>
              </div>
            ) : (
              <div>
                <span>{material.group} - {material.description} - ${material.value}</span>
                <button onClick={() => setEditMaterial({ ...material, index })}>Editar</button>
                <button onClick={() => handleDeleteMaterial(index)}>Eliminar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pmaterial;
