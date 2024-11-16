import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../general/Breadcrumb';
import NewMaterial from '../components/NewMaterial';
import MaterialList from '../components/MaterialList';

const Pmaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [filterGroup, setFilterGroup] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/materials');
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError('Error al cargar los materiales: ' + error.message);
    } finally {
      setLoading(false);
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
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="rounded-lg p-5">
        <Breadcrumb />

        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold mb-2"></h2>
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
<div className='bg-white p-5 rounded-lg' >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Lista de Materiales</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 " viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>

          </button>
        </div>

        <NewMaterial 
          onMaterialAdded={handleMaterialAdded}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <MaterialList 
          materials={filteredMaterials} 
          onMaterialUpdated={fetchMaterials}
        /></div>
      </div>
    </div>
  );
};

export default Pmaterial;