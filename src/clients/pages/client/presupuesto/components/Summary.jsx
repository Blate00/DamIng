import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../../supabase/client'; // Asegúrate de importar tu cliente de Supabase

const Summary = ({ total, formatCLP, projectId }) => {
  const [localGgPercentage, setLocalGgPercentage] = useState(0);
  const [localGestionPercentage, setLocalGestionPercentage] = useState(0);
  const [ggValue, setGgValue] = useState(0);
  const [gestionValue, setGestionValue] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const fetchPercentages = async () => {
      try {
        const { data, error } = await supabase
          .from('description_budgets')
          .select('gg_percentage, gestion_percentage')
          .eq('project_id', projectId)
          .limit(1)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setLocalGgPercentage(data.gg_percentage || 0);
          setLocalGestionPercentage(data.gestion_percentage || 0);
        } else {
          console.warn('No data found for the given project_id');
        }
      } catch (error) {
        console.error('Error fetching percentages:', error.message);
      }
    };

    fetchPercentages();
  }, [projectId]);

  useEffect(() => {
    const calculateValues = () => {
      const gg = (total * localGgPercentage) / 100;
      const gestion = (total * localGestionPercentage) / 100;
      setGgValue(gg);
      setGestionValue(gestion);
      setSubtotal(total + gg + gestion);
    };

    calculateValues();
  }, [total, localGgPercentage, localGestionPercentage]);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('description_budgets')
        .update({
          gg_percentage: localGgPercentage,
          gestion_percentage: localGestionPercentage
        })
        .eq('project_id', projectId);

      if (error) {
        throw error;
      }

      alert('Porcentajes actualizados en la base de datos.');
    } catch (error) {
      console.error('Error updating percentages:', error.message);
      alert('Error al actualizar los porcentajes.');
    }
  };

  return (
<div className="bg-gray-100 border border-r-l-b  rounded-b-lg shadow-xl p-5 space-y-4">
  <div className="space-y-3">
    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
      <span className="text-sm font-medium text-gray-600">Total:</span>
      <p className="text-base text-red-700 font-semibold">{formatCLP(total)}</p>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-600">GG (%):</span>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="number"
            value={localGgPercentage}
            onChange={(e) => setLocalGgPercentage(parseFloat(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-sm bg-transparent border-b border-gray-300 focus:border-red-600 focus:outline-none transition-colors duration-300"
            onBlur={handleSave}
          />
          <span className="absolute right-1 top-1 text-xs text-gray-400">%</span>
        </div>
        <p className="text-sm text-gray-700 font-semibold">{formatCLP(ggValue)}</p>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-600">Gestión (%):</span>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="number"
            value={localGestionPercentage}
            onChange={(e) => setLocalGestionPercentage(parseFloat(e.target.value) || 0)}
            className="w-16 px-2 py-1 text-sm bg-transparent border-b border-gray-300 focus:border-red-600 focus:outline-none transition-colors duration-300"
            onBlur={handleSave}
          />
          <span className="absolute right-1 top-1 text-xs text-gray-400">%</span>
        </div>
        <p className="text-sm text-gray-700 font-semibold">{formatCLP(gestionValue)}</p>
      </div>
    </div>
    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
      <span className="text-base font-medium text-gray-700">Subtotal:</span>
      <p className="text-base text-red-700 font-bold">{formatCLP(subtotal)}</p>
    </div>
  </div>
</div>
  );
};

export default Summary;