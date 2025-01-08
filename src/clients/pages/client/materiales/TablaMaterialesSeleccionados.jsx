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
  const [selectedMaterials, setSelectedMaterials] = useState(
    materiales.reduce((acc, material) => ({
      ...acc,
      [material.material_id]: material.in_database || material.is_selected || false
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
  const handleMaterialSelection = (materialId) => {
    setSelectedMaterials(prev => ({
      ...prev,
      [materialId]: !prev[materialId]
    }));
  
    // Si estamos seleccionando el material, establecemos cantidad inicial
    if (!selectedMaterials[materialId]) {
      setSelectedQuantities(prev => ({
        ...prev,
        [materialId]: 1
      }));
    }
  
    const updatedMaterials = localMaterials.map(material => ({
      ...material,
      is_selected: material.material_id === materialId ? 
        !selectedMaterials[materialId] : 
        selectedMaterials[material.material_id]
    }));
  
    onMaterialsChange?.(updatedMaterials);
  };
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
    const material = localMaterials.find(m => m.material_id === materialId);
    
    if (material.in_database) {
      // Si está en la base de datos, actualizamos todos los estados relevantes
      setSelectedMaterials(prev => ({
        ...prev,
        [materialId]: false
      }));
      
      setSelectedQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[materialId];
        return newQuantities;
      });
  
      const updatedMaterials = localMaterials.map(m => ({
        ...m,
        is_selected: m.material_id === materialId ? false : m.is_selected,
        quantity: m.material_id === materialId ? 1 : m.quantity // Resetear la cantidad
      }));
  
      setLocalMaterials(updatedMaterials);
      onMaterialsChange?.(updatedMaterials);
    } else {
      // Si no está en la base de datos
      if (window.confirm('¿Está seguro de que desea eliminar este material?')) {
        setSelectedQuantities(prev => {
          const newQuantities = { ...prev };
          delete newQuantities[materialId];
          return newQuantities;
        });
  
        const updatedMaterials = localMaterials.filter(
          m => m.material_id !== materialId
        );
        setLocalMaterials(updatedMaterials);
        onMaterialsChange?.(updatedMaterials);
      }
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
      if (material.in_database || selectedMaterials[material.material_id]) {
        const quantity = selectedQuantities[material.material_id] || 0;
        return {
          totalQuantity: acc.totalQuantity + quantity,
          totalAmount: acc.totalAmount + (quantity * (material.current_value || 0))
        };
      }
      return acc;
    }, { totalQuantity: 0, totalAmount: 0 });
  }, [filteredMaterials, selectedMaterials, selectedQuantities]);

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
        <tbody className="divide-y">
          {filteredMaterials.map((material, index) => (
            <tr
              key={`${material.material_id}-${index}`}
              className={`hover:bg-gray-50 transition-colors duration-200 ${
                selectedMaterials[material.material_id]
                  ? ''
                  : 'bg-white'
              }`}
            >
              <td className="py-4 px-6">
                <span className="text-gray-700">{material.category}</span>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    className={`w-full bg-transparent focus:outline-none ${
                      material.is_selected
                        ? 'text-green-700 font-medium'
                        : material.in_database
                        ? 'text-green-700'
                        : 'text-gray-700'
                    }`}
                    value={material.description}
                    readOnly
                  />
                 
                </div>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        material.material_id,
                        (selectedQuantities[material.material_id] || 0) - 1
                      )
                    }
                    className="text-red-600 hover:text-red-800 focus:outline-none hover:bg-red-100 p-1 rounded-full transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <input
                    type="number"
                    className="w-16 bg-transparent text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md"
                    value={selectedQuantities[material.material_id]}
                    onChange={(e) =>
                      handleQuantityChange(material.material_id, e.target.value)
                    }
                    min="0"
                  />
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        material.material_id,
                        (selectedQuantities[material.material_id] || 0) + 1
                      )
                    }
                    className="text-red-600 hover:text-red-800 focus:outline-none hover:bg-red-100 p-1 rounded-full transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
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
                  value={formatCLP(
                    selectedQuantities[material.material_id] * material.current_value
                  )}
                  readOnly
                />
              </td>
              <td className="py-4 px-6 text-center">
  {material.in_database || selectedMaterials[material.material_id] ? (
    // Botón para quitar/deseleccionar material
    <button
      onClick={() => handleDeleteMaterial(material.material_id)}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      title={material.in_database ? "Deseleccionar material" : "Eliminar material"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  ) : (
    // Botón para añadir/seleccionar material
    <button
      onClick={() => handleMaterialSelection(material.material_id)}
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      title="Añadir material"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )}
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