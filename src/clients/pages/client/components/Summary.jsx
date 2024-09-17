import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../supabase/client'; // Asegúrate de importar tu cliente de Supabase

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
<div className="flex flex-col border-r border-l border-b border-gray-300 bg-gray-100 p-6 mb- rounded-b-lg shadow-lg space-y-4">
  <div className="flex flex-col space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-lg font-medium text-gray-800">Total:</span>
      <p className="text-lg text-black font-bold">{formatCLP(total)}</p>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-lg font-medium text-gray-800">GG (%):</span>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={localGgPercentage}
          onChange={(e) => setLocalGgPercentage(parseFloat(e.target.value) || 0)}
          className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onBlur={handleSave}
        />
        <p className="text-lg text-black font-bold">{formatCLP(ggValue)}</p>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-lg font-medium text-gray-800">Gestión (%):</span>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={localGestionPercentage}
          onChange={(e) => setLocalGestionPercentage(parseFloat(e.target.value) || 0)}
          className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onBlur={handleSave}
        />
        <p className="text-lg text-black   font-bold">{formatCLP(gestionValue)}</p>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-lg font-medium text-gray-800">Subtotal:</span>
      <p className="text-lg text-black font-bold">{formatCLP(subtotal)}</p>
    </div>
  </div>
</div>
  );
};

export default Summary;