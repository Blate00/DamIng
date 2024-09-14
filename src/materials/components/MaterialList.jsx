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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Categoría</th>
            <th className="py-2 px-4 border-b text-left">Descripción</th>
            <th className="py-2 px-4 border-b text-left">Valor Actual</th>
            <th className="py-2 px-4 border-b text-left">Valor Actualizado</th>
            <th className="py-2 px-4 border-b text-left">Fecha de Entrada</th>
            <th className="py-2 px-4 border-b text-left">Última Actualización</th>
            <th className="py-2 px-4 border-b text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedMaterials.map((material) => (
            <tr key={material.material_id} className={`${isUpdateNeeded(material.entry_date, material.last_update_date) ? 'bg-yellow-100' : ''}`}>
              <td className="py-2 px-4 border-b">{material.category}</td>
              <td className="py-2 px-4 border-b">{material.description}</td>
              <td className="py-2 px-4 border-b">{formatCLP(material.current_value)}</td>
              <td className="py-2 px-4 border-b">{formatCLP(material.updated_value)}</td>
              <td className="py-2 px-4 border-b">{new Date(material.entry_date).toLocaleDateString('es-CL')}</td>
              <td className="py-2 px-4 border-b">{material.last_update_date ? new Date(material.last_update_date).toLocaleDateString('es-CL') : 'N/A'}</td>
              <td className="py-2 px-4 border-b">
                <button 
                  onClick={() => handleUpdateValue(material.material_id, material.current_value)}
                  className="bg-red-800 hover:bg-red-900 text-white font-bold py-1 px-2 rounded transition duration-300 mr-2"
                >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>

                </button>
                <button 
                  onClick={() => handleDeleteMaterial(material.material_id)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded transition duration-300"
                >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
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