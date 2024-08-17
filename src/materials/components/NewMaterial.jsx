import React, { useState } from 'react';

const NewMaterial = ({ addMaterial }) => {
  const [material, setMaterial] = useState({ name: '', category: '', value: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterial({ ...material, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (material.name.trim() && material.category.trim() && material.value.trim()) {
      addMaterial(material);
      setMaterial({ name: '', category: '', value: '' });
    }
  };

  return (
    <div className="p-4 rounded-md mb-4 sm:mb-4">
      <h2 className="text-lg font-semibold mb-2">Añadir Material</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
        <input
          type="text"
          name="name"
          value={material.name}
          onChange={handleChange}
          placeholder="Nombre del Material"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="category"
          value={material.category}
          onChange={handleChange}
          placeholder="Categoría"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="number"
          name="value"
          value={material.value}
          onChange={handleChange}
          placeholder="Valor"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="col-span-3 bg-red-800 text-white p-2 rounded hover:bg-red-900"
        >
          Añadir Material
        </button>
      </form>
    </div>
  );
};

export default NewMaterial;
