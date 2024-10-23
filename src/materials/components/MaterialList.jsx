import React from 'react';
import { supabase } from '../../supabase/client';

const MaterialList = ({ materials, onMaterialUpdated }) => {
  const handleUpdateValue = async (materialId, currentValue) => {
    const formattedCurrentValue = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(currentValue);
    const newValue = prompt("Ingrese el nuevo valor (CLP):", formattedCurrentValue);
    if (newValue) {
      const numericValue = parseInt(newValue.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(numericValue)) {
        try {
          const { data, error } = await supabase
            .rpc('update_material_value', { 
              p_material_id: materialId, 
              p_new_value: numericValue 
            });

          if (error) throw error;

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
        const { error } = await supabase
          .from('materiales')
          .delete()
          .eq('material_id', materialId);

        if (error) throw error;

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
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-red-800">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tl-lg">Categoría</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Descripción</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Valor Actual</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Valor Anterior</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fecha de Entrada</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Última Actualización</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tr-lg">Acciones</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {sortedMaterials.map((material, index) => (
          <tr key={material.material_id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${isUpdateNeeded(material.entry_date, material.last_update_date) ? 'bg-red-100' : ''} hover:bg-red-50 transition-colors duration-150`}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{material.category}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.description}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCLP(material.current_value)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCLP(material.updated_value)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(material.entry_date).toLocaleDateString('es-CL')}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.last_update_date ? new Date(material.last_update_date).toLocaleDateString('es-CL') : 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button 
                onClick={() => handleUpdateValue(material.material_id, material.current_value)}
                className="text-red-600 hover:text-red-900 mr-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </button>
              <button 
                onClick={() => handleDeleteMaterial(material.material_id)}
                className="text-red-600 hover:text-red-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default MaterialList;