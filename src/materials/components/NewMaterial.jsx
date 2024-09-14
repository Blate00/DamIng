import React, { useState } from 'react';
import { supabase } from '../../supabase/client';

const NewMaterial = ({ onMaterialAdded }) => {
  const [material, setMaterial] = useState({ category: '', description: '', current_value: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'current_value') {
      // Remove non-numeric characters and convert to number
      const numericValue = value.replace(/[^0-9]/g, '');
      setMaterial({ ...material, [name]: numericValue });
    } else {
      setMaterial({ ...material, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (material.category.trim() && material.description.trim() && material.current_value.trim()) {
      try {
        const numericValue = parseInt(material.current_value, 10);
        const { data, error } = await supabase
          .from('materiales')
          .insert({
            ...material,
            current_value: numericValue,
            updated_value: numericValue,
            entry_date: new Date().toISOString()
          })
          .select();

        if (error) throw error;

        onMaterialAdded(data[0]);
        setMaterial({ category: '', description: '', current_value: '' });
      } catch (error) {
        console.error('Error adding material:', error);
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded-md ">
      <h2 className="text-lg font-semibold mb-2">Añadir Nuevo Material</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="category"
          value={material.category}
          onChange={handleChange}
          placeholder="Categoría (1 carácter)"
          maxLength=""
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="description"
          value={material.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="current_value"
          value={material.current_value ? `${parseInt(material.current_value).toLocaleString('es-CL')}` : ''}
          onChange={handleChange}
          placeholder="Valor Actual (CLP)"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className=" bg-red-800 text-white p-2 rounded hover:bg-red-900 transition duration-300"
        >
          Añadir Material
        </button>
      </form>
    </div>
  );
};

export default NewMaterial;