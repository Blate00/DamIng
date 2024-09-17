import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../supabase/client';

const MaterialSearch = ({ handleAddMaterialWithQuantity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [materiales, setMaterials] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, [searchTerm]);

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('materiales')
      .select('material_id, category, description, current_value')
      .ilike('description', `%${searchTerm}%`)
      .limit(10);

    if (error) {
      console.error('Error fetching materials:', error);
    } else {
      setMaterials(data);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        className="p-2 border border-gray-300 rounded-md w-full"
        placeholder="Buscar material por descripción..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && materiales.length > 0 && (
        <div className="mt-2">
          <ul>
            {materiales.map((material) => (
              <li
                key={material.material_id}
                className="flex justify-between items-center p-2 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  handleAddMaterialWithQuantity(material, 1);
                  setSearchTerm('');
                }}
              >
                <span>{material.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MaterialSearch;