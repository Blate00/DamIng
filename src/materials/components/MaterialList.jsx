import React from 'react';
import axios from 'axios';

const MaterialList = ({ materials, onMaterialUpdated }) => {
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

  const sortedMaterials = [...materials].sort((a, b) => {
    const aNeedsUpdate = isUpdateNeeded(a.entry_date, a.last_update_date);
    const bNeedsUpdate = isUpdateNeeded(b.entry_date, b.last_update_date);
    if (aNeedsUpdate && !bNeedsUpdate) return -1;
    if (!aNeedsUpdate && bNeedsUpdate) return 1;
    return 0;
  });

  const formatCLP = (value) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl">
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-red-800 to-red-700">
            <th className="px-6 py-4 text-left text-sm font-semibold text-white tracking-wider rounded-tl-lg">
              <div className="flex items-center space-x-2">
                <span>Categoría</span>
              </div>
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white tracking-wider">
              Descripción
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white tracking-wider">
              Valor Actual
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white tracking-wider">
              Fecha Entrada
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white tracking-wider">
              Última Actualización
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-white tracking-wider rounded-tr-lg">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedMaterials.map((material, index) => (
            <tr 
              key={material.material_id} 
              className={`
                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                ${isUpdateNeeded(material.entry_date, material.last_update_date) ? 'bg-red-50' : ''}
                hover:bg-red-50 transition-all duration-200
                cursor-pointer
              `}
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <span className="text-red-800 font-medium">
                      {material.category.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{material.category}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{material.description}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-semibold text-gray-900">
                  {formatCLP(material.current_value)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {new Date(material.entry_date).toLocaleDateString('es-CL')}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${material.last_update_date ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                `}>
                  {material.last_update_date 
                    ? new Date(material.last_update_date).toLocaleDateString('es-CL')
                    : 'Pendiente'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleUpdateValue(material.material_id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteMaterial(material.material_id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {/* Paginación simplificada */}
    <div className="p-5   mt-4 flex items-center justify-between">
      <p className="text-sm text-gray-700">
        Total: <span className="font-medium">{sortedMaterials.length}</span> materiales
      </p>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors">
          Anterior
        </button>
        <button className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors">
          Siguiente
        </button>
      </div>
    </div>
  </div>  
  );
};

export default MaterialList;