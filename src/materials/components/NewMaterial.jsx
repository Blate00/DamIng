import React, { useState } from 'react';
import { supabase } from '../../supabase/client';

const NewMaterial = ({ onMaterialAdded }) => {
  const [material, setMaterial] = useState({ category: '', description: '', current_value: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'current_value') {
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
        setIsFormOpen(false);
      } catch (error) {
        console.error('Error adding material:', error);
      }
    }
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <div className="p-4 bg-white rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Añadir Nuevo Material</h2>
        <button onClick={toggleForm} className="focus:outline-none">
          {isFormOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          )}
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
          <input
            type="text"
            name="category"
            value={material.category}
            onChange={handleChange}
            placeholder="Categoría"
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
            className="bg-red-800 text-white p-2 rounded hover:bg-red-900 transition duration-300"
          >
            Añadir Material
          </button>
        </form>
      )}
    </div>
  );
};

export default NewMaterial;