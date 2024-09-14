import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import Breadcrumb from '../../general/Breadcrumb';
import NewMaterial from '../components/NewMaterial';
import MaterialList from '../components/MaterialList';

const Pmaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [filterGroup, setFilterGroup] = useState('');

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materiales')
        .select('*')
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const groups = [...new Set(materials.map(material => material.category))];

  const filteredMaterials = filterGroup
    ? materials.filter(material => material.category === filterGroup)
    : materials;

  const handleMaterialAdded = (newMaterial) => {
    setMaterials([newMaterial, ...materials]);
  };

  return (
    <div className="flex flex-col p-3  min-h-full">
      <div className="bg-white rounded-lg  p-5">
        <Breadcrumb />
        <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Gestión de Materiales</h1>

        <NewMaterial onMaterialAdded={handleMaterialAdded} />

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Filtrar por Grupo</h2>
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Mostrar Todos</option>
            {groups.map((group, index) => (
              <option key={index} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <h2 className="text-xl font-semibold mb-4">Lista de Materiales</h2>
        <MaterialList 
          materials={filteredMaterials} 
          onMaterialUpdated={fetchMaterials}
        />
      </div>
    </div>
  );
};

export default Pmaterial;