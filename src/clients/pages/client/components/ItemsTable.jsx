import React from 'react';

const ItemsTable = ({ items, handleChange, formatCLP, deleteItem }) => {
  // Función para guardar datos en localStorage
  const handleSave = () => {
    localStorage.setItem('items', JSON.stringify(items));
    alert('Datos guardados en el almacenamiento local.');
  };

  return (
    <div>
      <table className="min-w-full bg-white shadow-md rounded">
        <thead className=''>
          <tr>
            <th className="py-2 px-4 text-center">Descripción</th>
            <th className="py-2 px-4 text-center">Cantidad</th>
            <th className="py-2 px-4 text-center">Valor Unitario</th>
            <th className="py-2 px-4 text-center">Total</th>
            <th className="py-2 px-4 text-center">Acciones</th>
          </tr>
        </thead >
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="py-2 px-4">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="py-2 px-4 ">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="py-2 px-4 ">
                <input
                  type="number"
                  value={item.unitValue}
                  onChange={(e) => handleChange(index, 'unitValue', e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="py-2 px-4">
                {formatCLP(parseFloat(item.total) || 0)}
              </td>
              <td className="py-2 px-4  text-center">
                <button onClick={() => deleteItem(index)} className="text-red-600 hover:text-red-800">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-800">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Botón para guardar datos en localStorage */}
   
    </div>
  );
};

export default ItemsTable;
