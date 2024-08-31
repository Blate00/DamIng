import React, { useState } from 'react';

const MaterialSearch = ({ materials, handleAddMaterialWithQuantity }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar materiales según el término de búsqueda
  const filteredMaterials = materials.filter((material) =>
    material.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-4">
      <input
        type="text"
        className="p-2 border border-gray-300 rounded-md w-full"
        placeholder="Buscar material por descripción..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && filteredMaterials.length > 0 && (
        <div className="mt-2">
          <ul>
            {filteredMaterials.map((material, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  handleAddMaterialWithQuantity(material, 1); // Agregar con cantidad 1
                  setSearchTerm(''); // Limpiar la búsqueda después de añadir
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
