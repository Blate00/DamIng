import React, { useState, useMemo } from 'react';
import Summary from './Summary'; 

const TablaMaterialesSeleccionados = ({ materiales,
  onMaterialsChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [selectedQuantities, setSelectedQuantities] = useState(
    materiales.reduce((acc, material) => ({
      ...acc,
      [material.material_id]: material.quantity || 1
    }), {})
  );

  const [localMaterials, setLocalMaterials] = useState(materiales);
  const formatCLP = (value) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(value);
  }
  
  const uniqueCategories = [...new Set(localMaterials.map((material) => material.category))];

  // Manejar selección de categorías    
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  
  const handleQuantityChange = (materialId, value) => {
    const quantity = Math.max(0, parseInt(value) || 0);
    setSelectedQuantities(prev => {
      const newQuantities = {
        ...prev,
        [materialId]: quantity
      };

      
      const updatedMaterials = localMaterials.map(material => ({
        ...material,
        quantity: material.material_id === materialId ? quantity : (newQuantities[material.material_id] || 0)
      }));

      onMaterialsChange?.(updatedMaterials);
      return newQuantities;
    });
  };
  // Manejar eliminación de material  
  const handleDeleteMaterial = (materialId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este material?')) {
      // Actualizar cantidades seleccionadas
      setSelectedQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[materialId];
        return newQuantities;
      });

      // Actualizar materiales locales
      const updatedMaterials = localMaterials.filter(
        material => material.material_id !== materialId
      );
      setLocalMaterials(updatedMaterials);

      // Notificar al componente padre
      onMaterialsChange?.(updatedMaterials);
    }
  };

  // Filtrar materiales por categorías seleccionadas    
  const filteredMaterials = localMaterials.filter((material) => {
    return (
      selectedCategories.length === 0 || selectedCategories.includes(material.category)
    );
  });

 
  const totals = useMemo(() => {
    return filteredMaterials.reduce((acc, material) => {
      const quantity = selectedQuantities[material.material_id] || 0;
      return {
        totalQuantity: acc.totalQuantity + quantity,
        totalAmount: acc.totalAmount + (quantity * (material.current_value || 0))
      };
    }, { totalQuantity: 0, totalAmount: 0 });
  }, [filteredMaterials, selectedQuantities]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-red-800 rounded-t-xl">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider relative rounded-tl-xl">
              <div className="flex items-center justify-center space-x-2">
                <span>Categoría</span>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="inline-flex items-center justify-center p-1.5 rounded-md bg-red-700 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-800 transition-all duration-200"
                >
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              {isDropdownOpen && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white rounded-xl shadow-lg z-50 border border-gray-100 overflow-hidden">
                  <div className="p-3 border-b border-gray-100">
                    <label className="flex items-center space-x-3 py-1 px-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.length === 0}
                        onChange={() => setSelectedCategories([])}
                        className="form-checkbox h-5 w-5 text-red-800 rounded border-gray-300 focus:ring-red-800 transition-colors cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700">Seleccionar todo</span>
                    </label>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2">
                    <div className="space-y-1">
                      {uniqueCategories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center space-x-3 py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            className="form-checkbox h-5 w-5 text-red-800 rounded border-gray-300 focus:ring-red-800 transition-colors cursor-pointer"
                          />
                          <span className="text-sm text-gray-600 font-medium">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-800 hover:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Descripción</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Cantidad</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Valor Unitario</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider last:rounded-tr-xl">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-white">
          {filteredMaterials.map((material, index) => (
            <tr
              key={`${material.material_id}-${index}`}
              className={`hover:bg-gray-50 transition-colors duration-200 ${material.is_selected
                  ? 'bg-green-50 border-l-4 border-green-600'
                  : material.in_database
                    ? 'bg-blue-50 border-l-4 border-blue-500' 
                    : 'bg-white' 
                }`}
            >
              <td className="py-4 px-6">
                <input
                  type="text"
                  className="w-full bg-transparent text-gray-700 focus:outline-none"
                  value={material.category}
                  readOnly
                />
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    className={`w-full bg-transparent focus:outline-none ${material.is_selected
                        ? 'text-green-700 font-medium'
                        : material.in_database
                          ? 'text-blue-700'
                          : 'text-gray-700'
                      }`}
                    value={material.description}
                    readOnly
                  />
                  {material.in_database && (
                    <div className="relative group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${material.is_selected ? 'text-green-500' : 'text-blue-500'
                          }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -mt-1 ml-6 whitespace-nowrap">
                        {material.is_selected
                          ? 'Material seleccionado en BD'
                          : 'Material disponible en BD'
                        }
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td className="py-4 px-6 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(material.material_id, (selectedQuantities[material.material_id] || 0) - 1)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    className="w-16 bg-transparent text-center text-gray-700 focus:outline-none"
                    value={selectedQuantities[material.material_id]}
                    onChange={(e) => handleQuantityChange(material.material_id, e.target.value)}
                    min="0"
                  />
                  <button
                    onClick={() => handleQuantityChange(material.material_id, (selectedQuantities[material.material_id] || 0) + 1)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </td>
              <td className="py-4 px-6 text-center">
                <input
                  type="text"
                  className="w-full bg-transparent text-center text-gray-700 focus:outline-none"
                  value={formatCLP(material.current_value)}
                  readOnly
                />
              </td>
              <td className="py-4 px-6 text-center">
                <input
                  type="text"
                  className="w-full bg-transparent text-center text-gray-700 focus:outline-none"
                  value={formatCLP(selectedQuantities[material.material_id] * material.current_value)}
                  readOnly
                />
              </td>
              <td className="py-4 px-6 text-center">
                <button
                  onClick={() => handleDeleteMaterial(material.material_id)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Summary
        filteredMaterials={filteredMaterials}
        totals={totals}
        selectedCategories={selectedCategories}
      />
    </div>
  );
};

export default TablaMaterialesSeleccionados;  