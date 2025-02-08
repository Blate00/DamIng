import React, { useState } from 'react';
import TablaRendicionMobile from './TablaRendicionMobile';
const TablaRendicion = ({ 
  items, 
  handleChange, 
  deleteItem, 
  proveedores, 
  handleProveedorChange,
  formatCLP 
}) => {
  const [proveedorSearchText, setProveedorSearchText] = useState({});

  const handleTotalChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    handleChange(index, 'total', numericValue);
  };

  const handleProveedorInputChange = (index, value) => {
    setProveedorSearchText({ ...proveedorSearchText, [index]: value });
    
    // Solo actualiza el ID cuando hay una coincidencia exacta
    const proveedor = proveedores.find(p => 
      p.nombre.toLowerCase() === value.toLowerCase()
    );

    if (proveedor) {
      handleProveedorChange(index, proveedor.proveedor_id);
    }

  };

  const getProveedorDisplayText = (index, item) => {
    if (proveedorSearchText.hasOwnProperty(index)) {
      return proveedorSearchText[index];
    }
    
    if (item.proveedor_id) {
      const proveedor = proveedores.find(p => p.proveedor_id === item.proveedor_id);
      return proveedor ? proveedor.nombre : '';
    }

    return '';
  };

  const handleProveedorBlur = (index) => {
    const currentText = proveedorSearchText[index] || '';
    const proveedor = proveedores.find(p => 
      p.nombre.toLowerCase() === currentText.toLowerCase()
    );

    if (!proveedor) {
      const originalProveedor = items[index].proveedor_id ? 
        proveedores.find(p => p.proveedor_id === items[index].proveedor_id) : null;
      
      setProveedorSearchText({
        ...proveedorSearchText,
        [index]: originalProveedor ? originalProveedor.nombre : ''
      });
    }
  };

  const getSuggestions = (searchText) => {
    if (!searchText) return [];
    const inputValue = searchText.trim().toLowerCase();
    return proveedores.filter(proveedor => 
      proveedor.nombre.toLowerCase().includes(inputValue)
    );
  };if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow-sm p-8">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <svg 
              className="w-20 h-20 mx-auto text-red-600/80" 
              fill="none" 
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            ¡Comienza tu rendición!
          </h2>
          <p className="text-gray-500 mb-6">
            Agrega tu primer ítem para comenzar a crear tu rendición
          </p>
        </div>
      </div>
    );
  }

  return (<>
    <div className="hidden md:block overflow-x-auto rounded-t-lg border border-r-l bg-white">
      <div className="overflow-hidden rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-red-800 to-red-700">
              {['Fecha', 'Detalle', 'Folio', 'Proveedor', 'Documento', 'Total', 'Acciones'].map((header, index) => (
                <th key={header} className={`px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider ${index === 0 ? 'rounded-tl-xl' : ''} ${index === 6 ? 'rounded-tr-xl' : ''}`}>
                  <span className="flex items-center justify-center space-x-2">
                    {header}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-all duration-200">
                <td className="px-6 py-4">
                  <input
                    type="date"
                    value={item.fecha ? item.fecha.split('T')[0] : ''}
                    onChange={(e) => handleChange(index, 'fecha', e.target.value)}
                    className="w-full bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 transition-all duration-200"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={item.detalle || ''}
                    onChange={(e) => handleChange(index, 'detalle', e.target.value)}
                    className="w-full bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 transition-all duration-200"
                    placeholder="Ingresa un detalle"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={item.folio || ''}
                    onChange={(e) => handleChange(index, 'folio', e.target.value)}
                    className="w-full bg-transparent text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 transition-all duration-200"
                    placeholder="Ingresa el folio"
                  />
                </td>
                <td className="px-6 py-4 relative">
                  <input
                    type="text"
                    value={getProveedorDisplayText(index, item)}
                    onChange={(e) => handleProveedorInputChange(index, e.target.value)}
                    onBlur={() => handleProveedorBlur(index)}
                    className="w-full bg-transparent text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 transition-all duration-200"
                    placeholder="Buscar proveedor..."
                    list={`proveedores-${index}`}
                  />
                  <datalist id={`proveedores-${index}`}>
                    {getSuggestions(proveedorSearchText[index]).map((proveedor) => (
                      <option key={proveedor.proveedor_id} value={proveedor.nombre} />
                    ))}
                  </datalist>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={item.documento || ''}
                    onChange={(e) => handleChange(index, 'documento', e.target.value)}
                    className="w-full bg-transparent text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 transition-all duration-200"
                    placeholder="Ingresa el documento"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={formatCLP(item.total) || ''}
                    onChange={(e) => handleTotalChange(index, e.target.value)}
                    className="w-full bg-transparent text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 transition-all duration-200"
                    placeholder="Ingresa el total"
                  />
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
    </div><TablaRendicionMobile
    items={items}
    handleChange={handleChange}
    deleteItem={deleteItem}
    proveedores={proveedores}
    handleProveedorChange={handleProveedorChange}
    formatCLP={formatCLP}
    proveedorSearchText={proveedorSearchText}
    handleProveedorInputChange={handleProveedorInputChange}
    handleProveedorBlur={handleProveedorBlur}
    getSuggestions={getSuggestions}
    getProveedorDisplayText={getProveedorDisplayText}
  /></>
  );
};

export default TablaRendicion;