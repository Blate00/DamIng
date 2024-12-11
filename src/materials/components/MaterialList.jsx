import React, { useState } from 'react';  
import axios from 'axios';  

const MaterialList = ({ materials, onMaterialUpdated }) => {  
  const [selectedCategories, setSelectedCategories] = useState([]);  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  
  const [searchTerm, setSearchTerm] = useState('');  

  const handleUpdateValue = async (materialId, currentValue) => {  
    const formattedCurrentValue = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(currentValue);  
    const newValue = prompt("Ingrese el nuevo valor (CLP):", formattedCurrentValue);  
    if (newValue) {  
      const numericValue = parseInt(newValue.replace(/[^0-9]/g, ''), 10);  
      if (!isNaN(numericValue)) {  
        try {  
          await axios.put(`http://localhost:5000/api/materials/${materialId}`, {  
            new_value: numericValue  
          });  
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
        await axios.delete(`http://localhost:5000/api/materials/${materialId}`);  
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

  const uniqueCategories = [...new Set(materials.map((material) => material.category))];  

  const handleCategoryChange = (category) => {  
    setSelectedCategories((prev) =>  
      prev.includes(category)  
        ? prev.filter((c) => c !== category)  
        : [...prev, category]  
    );  
  };  

  const filteredMaterials = materials.filter((material) => {  
    const matchesCategory =  
      selectedCategories.length === 0 || selectedCategories.includes(material.category);  
    const matchesSearch = material.category.toLowerCase().includes(searchTerm.toLowerCase());  
    return matchesCategory && matchesSearch;  
  });  

  const formatCLP = (value) => {  
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);  
  };  

  return (  
    <div className="bg-white rounded-xl">  
      <div className="overflow-x-auto">  
        <table className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">  
          <thead>  
            <tr className="bg-gradient-to-r from-red-700 to-red-500 text-white">  
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider rounded-tl-lg relative">  
  <div className="flex items-center space-x-2">  
    <span>Grupo</span>  
    <button  
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}  
      className="text-white hover:text-gray-200 focus:outline-none"  
    >  
      ▼  
    </button>  
  </div>  
  {isDropdownOpen && (  
    <div  
      className="absolute top-full left-0 mt-2 w-64 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg z-50"  
      style={{ minWidth: '200px' }}  
    >  
      <div className="p-2">  
        <label className="flex items-center space-x-2">  
          <input  
            type="checkbox"  
            checked={selectedCategories.length === 0}  
            onChange={() => setSelectedCategories([])}  
            className="form-checkbox h-5 w-5 text-blue-500 border-gray-600 focus:ring-blue-500"  
          />  
          <span className="text-sm font-medium">Seleccionar todo</span>  
        </label>  
      </div>  
      <div className="max-h-40 overflow-y-auto">  
        {uniqueCategories.map((category) => (  
          <label  
            key={category}  
            className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"  
          >  
            <input  
              type="checkbox"  
              checked={selectedCategories.includes(category)}  
              onChange={() => handleCategoryChange(category)}  
              className="form-checkbox h-5 w-5 text-blue-500 border-gray-600 focus:ring-blue-500"  
            />  
            <span className="text-sm font-medium">{category}</span>  
          </label>  
        ))}  
      </div>  
      <div className="p-2 flex justify-end space-x-2">  
        <button  
          onClick={() => setIsDropdownOpen(false)}  
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"  
        >  
          Aceptar  
        </button>  
        <button  
          onClick={() => setIsDropdownOpen(false)}  
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"  
        >  
          Cancelar  
        </button>  
      </div>  
    </div>  
  )}  
</th>  
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">  
                Descripción  
              </th>  
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">  
                Valor Actual  
              </th>  
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">  
                Fecha Entrada  
              </th>  
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">  
                Última Actualización  
              </th>  
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider rounded-tr-lg">  
                Acciones  
              </th>  
            </tr>  
          </thead>  
          <tbody className="divide-y divide-gray-200">  
            {filteredMaterials.map((material, index) => (  
              <tr  
                key={material.material_id}  
                className={`${  
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'  
                } hover:bg-red-100 transition-all duration-200`}  
              >  
                <td className="px-6 py-4">  
                  <div className="text-sm font-medium text-gray-900">{material.category}</div>  
                </td>  
                <td className="px-6 py-4">  
                  <div className="text-sm text-gray-700">{material.description}</div>  
                </td>  
                <td className="px-6 py-4">  
                  <div className="text-sm font-semibold text-gray-900">  
                    {formatCLP(material.current_value)}  
                  </div>  
                </td>  
                <td className="px-6 py-4">  
                  <div className="text-sm text-gray-700">  
                    {new Date(material.entry_date).toLocaleDateString('es-CL')}  
                  </div>  
                </td>  
                <td className="px-6 py-4">  
                  <span  
                    className={`px-3 py-1 rounded-full text-xs font-medium ${  
                      material.last_update_date  
                        ? 'bg-green-100 text-green-800'  
                        : 'bg-yellow-100 text-yellow-800'  
                    }`}  
                  >  
                    {material.last_update_date  
                      ? new Date(material.last_update_date).toLocaleDateString('es-CL')  
                      : 'Pendiente'}  
                  </span>  
                </td>  
                <td className="px-6 py-4">  
                  <div className="flex space-x-2">  
                    <button  
                      onClick={() => handleUpdateValue(material.material_id, material.current_value)}  
                      className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-200"  
                    >  
                      ✏️  
                    </button>  
                    <button  
                      onClick={() => handleDeleteMaterial(material.material_id)}  
                      className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"  
                    >  
                      🗑️  
                    </button>  
                  </div>  
                </td>  
              </tr>  
            ))}  
          </tbody>  
        </table>  
      </div>  
    </div>  
  );  
};  

export default MaterialList;  