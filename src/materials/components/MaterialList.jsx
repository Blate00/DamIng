import React, { useState } from 'react';
import axios from 'axios';

const MaterialList = ({ materials, onMaterialUpdated }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdateValue = async (materialId, currentValue) => {
    const formattedCurrentValue = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(currentValue);
    const newValue = prompt("Ingrese el nuevo valor (CLP):", formattedCurrentValue);
    if (newValue) {
      const numericValue = parseInt(newValue.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(numericValue)) {
        try {
          await axios.put(`http://localhost:5000/api/materials/${materialId}`, {
            new_value: numericValue
          });
          onMaterialUpdated();
        } catch (error) {
          console.error('Error updating material value:', error);
        }
      }
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este material?')) {
      try {
        await axios.delete(`http://localhost:5000/api/materials/${materialId}`);
        onMaterialUpdated();
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  const isUpdateNeeded = (entryDate, lastUpdateDate) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const lastUpdate = lastUpdateDate ? new Date(lastUpdateDate) : new Date(entryDate);
    return lastUpdate < threeMonthsAgo;
  };

  const uniqueCategories = [...new Set(materials.map((material) => material.category))];

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(material.category);
    const matchesSearch = material.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatCLP = (value) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };

  return (
    <div className="bg-white rounded-xl">
      <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-xl shadow-xl overflow-hidden">
  <thead>
    <tr className="bg-gradient-to-r from-red-800 via-red-600 to-red-500">
      <th className="px-8 py-5 text-left relative">
        <div className="flex items-center gap-3">
          <span className="text-white text-sm font-bold tracking-wider uppercase">
            Grupo
          </span>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none"
          >
            <svg className={`w-4 h-4 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
            <div className="p-3 border-b border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.length === 0}
                  onChange={() => setSelectedCategories([])}
                  className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-gray-700 font-medium">Seleccionar todo</span>
              </label>
            </div>
            
            <div className="max-h-48 overflow-y-auto custom-scrollbar">
              {uniqueCategories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-gray-600">{category}</span>
                </label>
              ))}
            </div>
            
            <div className="p-3 bg-gray-50 flex justify-end gap-2 rounded-b-xl">
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Aceptar
              </button>
            </div>
          </div>
        )}
      </th>
      {/* Otros encabezados con el mismo estilo */}
      <th className="px-8 py-5 text-left text-white text-sm font-bold tracking-wider uppercase">
        Descripción
      </th>
      <th className="px-8 py-5 text-left text-white text-sm font-bold tracking-wider uppercase">
        Valor Actual
      </th>
      <th className="px-8 py-5 text-left text-white text-sm font-bold tracking-wider uppercase">
        Fecha Entrada
      </th>
      <th className="px-8 py-5 text-left text-white text-sm font-bold tracking-wider uppercase">
        Última Actualización
      </th>
      <th className="px-8 py-5 text-left text-white text-sm font-bold tracking-wider uppercase">
        Acciones
      </th>
    </tr>
  </thead>
  
  <tbody className="divide-y divide-gray-100">
    {filteredMaterials.map((material, index) => (
      <tr
        key={material.material_id}
        className="hover:bg-red-50 transition-colors duration-200"
      >
        <td className="px-8 py-4">
          <div className="font-medium text-gray-900">{material.category}</div>
        </td>
        <td className="px-8 py-4">
          <div className="text-gray-600">{material.description}</div>
        </td>
        <td className="px-8 py-4">
          <div className="font-semibold text-gray-900">
            {formatCLP(material.current_value)}
          </div>
        </td>
        <td className="px-8 py-4">
          <div className="text-gray-600">
            {new Date(material.entry_date).toLocaleDateString('es-CL')}
          </div>
        </td>
        <td className="px-8 py-4">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-medium ${
              material.last_update_date
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {material.last_update_date
              ? new Date(material.last_update_date).toLocaleDateString('es-CL')
              : 'Pendiente'}
          </span>
        </td>
        <td className="px-8 py-4">
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdateValue(material.material_id, material.current_value)}
              className="p-2.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
              title="Editar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => handleDeleteMaterial(material.material_id)}
              className="p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
              title="Eliminar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>
    </div>
  );
};

export default MaterialList;  