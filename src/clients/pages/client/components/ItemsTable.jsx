import React from 'react';

const ItemsTable = ({ items, handleChange, formatCLP, deleteItem }) => {
  const handleUpdateQuantity = (index, delta) => {
    const newQuantity = Math.max(0, (items[index].quantity || 0) + delta);
    handleChange(index, 'quantity', newQuantity);
  };

  return (
    <div>
      <table className="min-w-full bg-white border-r border-l border-gray-300 shadow-lg">
        <thead className='bg-gray-100'>
          <tr>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Descripción</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Cantidad</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Valor Unitario</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Total</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="py-2 px-4">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              </td>
              <td className="py-2 px-4">
                <div className="flex items-center justify-center">
                  <button 
                    onClick={() => handleUpdateQuantity(index, -1)} 
                    className="px-2 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700"
                  >
                    -
                  </button>
                  <span className="mx-2 font-medium text-gray-700">{item.quantity}</span>
                  <button 
                    onClick={() => handleUpdateQuantity(index, 1)} 
                    className="px-2 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="py-2 px-4 text-center">
                <input
                  type="number"
                  value={item.unitValue}
                  onChange={(e) => handleChange(index, 'unitValue', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              </td>
              <td className="py-2 px-4 text-center">
                {formatCLP(parseFloat(item.total) || 0)}
              </td>
              <td className="py-2 px-4 text-center">
                <button onClick={() => deleteItem(index)} className="">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsTable;