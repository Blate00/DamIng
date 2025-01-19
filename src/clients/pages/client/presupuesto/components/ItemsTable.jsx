import { useEffect } from 'react';
import ItemsTableMobile from './ItemsTableMobile';

const ItemsTable = ({ items, handleChange, formatCLP, deleteItem }) => {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleUpdateQuantity = (index, delta) => {
    const newQuantity = Math.max(0, (items[index].quantity || 0) + delta);
    handleChange(index, 'quantity', newQuantity);
  };

  const handleUnitValueChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const newUnitValue = parseFloat(numericValue) || 0;
    handleChange(index, 'unit_price', newUnitValue);
  };

  return (<>
<div className="hidden md:block overflow-x-auto rounded-t-lg border border-r-l bg-white">
        <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
    {/* Header */}
    <thead>
      <tr className="bg-gradient-to-r from-red-800 to-red-700">
        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider rounded-tl-xl">
          <span className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Descripción</span>
          </span>
        </th>
        <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
          <span className="flex items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            <span>Cantidad</span>
          </span>
        </th>
        <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
          <span className="flex items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Valor Unitario</span>
          </span>
        </th>
        <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
          <span className="flex items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Total</span>
          </span>
        </th>
        <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider rounded-tr-xl">Acciones</th>
      </tr>
    </thead>

    {/* Body */}
    <tbody className="bg-white divide-y divide-gray-100">
      {items.map((item, index) => (
        <tr key={index} className="hover:bg-gray-50 transition-all duration-200">
          <td className="px-6 py-4">
            <input
              type="text"
              value={item.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              className="w-full bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 transition-all duration-200"
              placeholder="Descripción del ítem"
            />
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => handleUpdateQuantity(index, -1)}
                className="p-1.5 rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 0;
                  handleUpdateQuantity(index, newQuantity - item.quantity);
                }}
                className="w-20 text-center border border-gray-300 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="0"
              />
              <button
                onClick={() => handleUpdateQuantity(index, 1)}
                className="p-1.5 rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </td>
          <td className="px-6 py-4">
            <input
              type="text"
              value={formatCLP(item.unit_price)}
              onChange={(e) => handleUnitValueChange(index, e.target.value)}
              className="w-full bg-transparent text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 transition-all duration-200"
              placeholder="\$0"
            />
          </td>
          <td className="px-6 py-4">
            <span className="inline-block w-full text-center font-medium text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
              {formatCLP(parseFloat(item.total) || 0)}
            </span>
          </td>
          <td className="px-6 py-4">
            <div className="flex justify-center">
              <button
                onClick={() => deleteItem(index)}
                className="p-2 rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                title="Eliminar ítem"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  
</div>
    </div><div className="md:hidden">
        <ItemsTableMobile
          items={items}
          handleChange={handleChange}
          formatCLP={formatCLP}
          deleteItem={deleteItem}
          handleUpdateQuantity={handleUpdateQuantity}
          handleUnitValueChange={handleUnitValueChange}
        />
      </div></>
  );
};

export default ItemsTable;
