import React, { useState } from 'react';

const BuscadorMateriales = ({ onMaterialSelect, searchMaterials }) => {
const [searchTerm, setSearchTerm] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [loading, setLoading] = useState(false);

const handleSearch = async (value) => {
  setSearchTerm(value);
  if (value.length < 2) {
    setSearchResults([]);
    return;
  }

  setLoading(true);
  try {
    const results = await searchMaterials(value);
    setSearchResults(results);
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    setSearchResults([]);
  } finally {
    setLoading(false);
  }
};

return (
  <div className="relative">
    <div className="flex gap-4 mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar material..."
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
      />
    </div>

    {loading && (
      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2">
        Buscando...
      </div>
    )}

    {searchResults.length > 0 && (
      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
        {searchResults.map((material) => (
          <div
            key={material.material_id}
            className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
            onClick={() => {
              onMaterialSelect(material);
              setSearchTerm('');
              setSearchResults([]);
            }}
          >
            <div>
              <div className="font-medium">{material.description}</div>
              <div className="text-sm text-gray-600">{material.category}</div>
            </div>
            <div className="text-red-600 font-medium">
              {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(material.current_value)}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default BuscadorMateriales;