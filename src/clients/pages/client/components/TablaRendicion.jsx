import React from 'react';

const TablaRendicion = ({ 
  items, 
  handleChange, 
  agregarFila, 
  deleteItem, 
  proveedores, 
  handleProveedorChange,
  formatCLP // Añadimos formatCLP como prop
}) => {
  const handleTotalChange = (index, value) => {
    // Removemos cualquier carácter que no sea número
    const numericValue = value.replace(/[^0-9]/g, '');
    handleChange(index, 'total', numericValue);
    if (numericValue !== '' && index === items.length - 1) {
      agregarFila();
    }
  };

  const getSuggestions = (value) => {
    if (!value) return [];
    const inputValue = value.trim().toLowerCase();
    return proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(inputValue)
    );
  };

  return (
    <div className="overflow-x-auto rounded-t-lg border border-r-l bg-white shadow-xl">
    <table className="min-w-full">
      <thead className="bg-red-800">
        <tr>
          <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Fecha</th>
          <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Detalle</th>
          <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Folio</th>
          <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Proveedor</th>
          <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Documento</th>
          <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Total</th>
          <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
            <td className="py-4 px-6">
              <input
                type="date"
                className="w-full bg-transparent text-gray-700 focus:outline-none"
                value={item.fecha || ''}
                onChange={(e) => handleChange(index, 'fecha', e.target.value)}
                placeholder="Selecciona una fecha"
              />
            </td>
            <td className="py-4 px-6">
              <input
                type="text"
                className="w-full bg-transparent text-gray-700 focus:outline-none"
                value={item.detalle || ''}
                onChange={(e) => handleChange(index, 'detalle', e.target.value)}
                placeholder="Ingresa un detalle"
              />
            </td>
            <td className="py-4 px-6 text-center">
              <input
                type="text"
                className="w-full bg-transparent text-center text-gray-700 focus:outline-none"
                value={item.folio || ''}
                onChange={(e) => handleChange(index, 'folio', e.target.value)}
                placeholder="Ingresa el folio"
              />
            </td>
            <td className="py-4 px-6 text-center">
              <input
                type="text"
                className="w-full bg-transparent text-center text-gray-700 focus:outline-none"
                value={item.proveedor || ''}
                onChange={(e) => handleProveedorChange(index, e.target.value)}
                list={`proveedores-${index}`}
                placeholder="Selecciona un proveedor"
              />
              <datalist id={`proveedores-${index}`}>
                {getSuggestions(item.proveedor).map((suggestion, i) => (
                  <option key={i} value={suggestion.nombre} />
                ))}
              </datalist>
            </td>
            <td className="py-4 px-6 text-center">
              <input
                type="text"
                className="w-full bg-transparent text-center text-gray-700 focus:outline-none"
                value={item.documento || ''}
                onChange={(e) => handleChange(index, 'documento', e.target.value)}
                placeholder="Ingresa el documento"
              />
            </td>
            <td className="py-4 px-6 text-center">
              <input
                type="text"
                className="w-full bg-transparent text-center text-gray-700 focus:outline-none"
                value={formatCLP(item.total) || ''}
                onChange={(e) => handleTotalChange(index, e.target.value)}
                placeholder="Ingresa el total"
              />
            </td>
            <td className="py-4 px-6 text-center">
              <button
                onClick={() => deleteItem(index)}
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
  </div>
  );
};

export default TablaRendicion;