import React from 'react';  

const Summary = ({ filteredMaterials, totals, selectedCategories }) => {  
  // Función para formatear moneda  
  const formatCLP = (value) => {  
    return new Intl.NumberFormat('es-CL', {  
      style: 'currency',  
      currency: 'CLP',  
    }).format(value);  
  };  

  return (  
    <div className="flex flex-col bg-gray-100 p-6 border-r border-l border-b border-gray-300 rounded-b-xl space-y-4">  
      <div className="flex flex-col space-y-3">  
        <div className="flex justify-between items-center border-gray-200">  
          <span className="text-md font-medium text-black">Total de Items:</span>  
          <p className="text-base text-red-700 font-bold">  
            {filteredMaterials.length}  
          </p>  
        </div>  
        <div className="flex justify-between items-center">  
          <span className="text-md font-medium text-black">Total de Unidades:</span>  
          <p className="text-base text-red-700 font-bold">  
            {totals.totalQuantity}  
          </p>  
        </div>  
        <div className="flex justify-between items-center">  
          <span className="text-md font-medium text-black">Categorías Seleccionadas:</span>  
          <p className="text-base text-red-700 font-bold">  
            {selectedCategories.length || 'Todas'}  
          </p>  
        </div>  
        <div className="flex justify-between items-center">  
          <span className="text-md font-medium text-black">Monto Total:</span>  
          <p className="text-base text-red-700 font-bold">  
            {formatCLP(totals.totalAmount)}  
          </p>  
        </div>  
      </div>  
    </div>  
  );  
};  

export default Summary;  