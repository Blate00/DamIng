  import React from 'react';

const MaterialList = ({ materials, editMaterial, deleteMaterial }) => {
  const handleEdit = (index) => {
    const name = prompt("Enter new material name:", materials[index].name);
    const category = prompt("Enter new category:", materials[index].category);
    const value = prompt("Enter new value:", materials[index].value);

    if (name && category && value) {
      editMaterial(index, { name, category, value });
    }
  };

  return (
    <div className="material-list">
      {materials.map((material, index) => (
        <div key={index} className="material-item">
          <p><strong>{material.name}</strong> (Category: {material.category}) - Value: {material.value}</p>
          <button onClick={() => handleEdit(index)}>Edit</button>
          <button onClick={() => deleteMaterial(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default MaterialList;
