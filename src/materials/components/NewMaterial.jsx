import React, { useState } from 'react';

const NewMaterial = ({ addMaterial }) => {
  const [material, setMaterial] = useState({ name: '', category: '', value: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterial({ ...material, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMaterial(material);
    setMaterial({ name: '', category: '', value: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={material.name}
        onChange={handleChange}
        placeholder="Material Name"
        required
      />
      <input
        type="text"
        name="category"
        value={material.category}
        onChange={handleChange}
        placeholder="Category"
        required
      />
      <input
        type="number"
        name="value"
        value={material.value}
        onChange={handleChange}
        placeholder="Value"
        required
      />
      <button type="submit">Add Material</button>
    </form>
  );
};

export default NewMaterial;