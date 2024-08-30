import React from 'react';

const ItemsTable = ({ items, handleChange, formatCLP }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto">
      <thead className="bg-red-800 text-white">
        <tr>
          <th className="py-2 px-2 md:px-4 border text-xs md:text-base">Item</th>
          <th className="py-2 px-2 md:px-4 border text-xs md:text-base">Descripción</th>
          <th className="py-2 px-2 md:px-4 border text-xs md:text-base">Cantidad</th>
          <th className="py-2 px-2 md:px-4 border text-xs md:text-base">Valor Unit</th>
          <th className="py-2 px-2 md:px-4 border text-xs md:text-base">Total</th>
        </tr>
      </thead>
      <tbody className="text-center">
        {items.map((item, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="py-2 px-2 md:px-4 border text-xs md:text-base">{index + 1}</td>
            <td className="py-2 px-2 md:px-4 border">
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                className="p-1 w-full text-left text-xs md:text-base border-none"
              />
            </td>
            <td className="py-2 px-2 md:px-4 border">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                className="p-1 w-full text-left text-xs md:text-base border-none"
              />
            </td>
            <td className="py-2 px-2 md:px-4 border">
              <input
                type="number"
                value={item.unitValue}
                onChange={(e) => handleChange(index, 'unitValue', e.target.value)}
                className="p-1 w-full text-left text-xs md:text-base border-none"
              />
            </td>
            <td className="py-2 px-2 md:px-4 border text-xs md:text-base">{formatCLP(item.total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ItemsTable;
