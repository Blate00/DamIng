import React, { useState } from 'react';
import axios from 'axios';

const NewMaterial = ({ onMaterialAdded, isOpen, onClose }) => {
  const [material, setMaterial] = useState({ category: '', description: '', current_value: '' });

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
        const response = await axios.post('http://localhost:5000/api/materials', {
          ...material,
          current_value: numericValue,
        });

        onMaterialAdded(response.data);
        setMaterial({ category: '', description: '', current_value: '' });
        onClose();
      } catch (error) {
        console.error('Error adding material:', error);
      }
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-[#f1f7fc] to-white shadow-2xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-red-100">
          <h3 className="text-2xl font-bold text-red-800"></h3>
          <button onClick={onClose} className="text-red-500 hover:text-red-700 transition-colors duration-200">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <input
                type="text"
                id="category"
                name="category"
                value={material.category}
                onChange={handleChange}
                placeholder="Ingrese la categoría"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input
                type="text"
                id="description"
                name="description"
                value={material.description}
                onChange={handleChange}
                placeholder="Ingrese la descripción"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="current_value" className="block text-sm font-medium text-gray-700 mb-1">Valor Actual (CLP)</label>
              <input
                type="text"
                id="current_value"
                name="current_value"
                value={material.current_value ? `${parseInt(material.current_value).toLocaleString('es-CL')}` : ''}
                onChange={handleChange}
                placeholder="Ingrese el valor actual"
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                required
              />
            </div>
          </form>
        </div>
        <div className="border-t border-red-100 p-6">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Añadir Material
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMaterial;