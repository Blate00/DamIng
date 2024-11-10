import React, { useState } from 'react';

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
    // Si no hay coincidencia exacta, solo actualizamos el texto de búsqueda
    // sin modificar el ID del proveedor
  };

  const getProveedorDisplayText = (index, item) => {
    // Si hay texto de búsqueda, muestra ese texto
    if (proveedorSearchText.hasOwnProperty(index)) {
      return proveedorSearchText[index];
    }
    
    // Si no hay texto de búsqueda pero hay un ID, muestra el nombre del proveedor
    if (item.proveedor_id) {
      const proveedor = proveedores.find(p => p.proveedor_id === item.proveedor_id);
      return proveedor ? proveedor.nombre : '';
    }

    return '';
  };

  const handleProveedorBlur = (index) => {
    // Cuando el input pierde el foco, verificamos si el texto coincide con algún proveedor
    const currentText = proveedorSearchText[index] || '';
    const proveedor = proveedores.find(p => 
      p.nombre.toLowerCase() === currentText.toLowerCase()
    );

    if (!proveedor) {
      // Si no hay coincidencia, restauramos el nombre del proveedor original
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
  };
  return (
    <div className="overflow-x-auto rounded-t-xl border border-r-l bg-white">
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
                  value={item.fecha ? item.fecha.split('T')[0] : ''}
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
              <td className="py-4 px-6 text-center relative">
                <input
                  type="text"
                  className="w-full bg-transparent text-center text-gray-700 focus:outline-none"
                  value={getProveedorDisplayText(index, item)}
                  onChange={(e) => handleProveedorInputChange(index, e.target.value)}
                  onBlur={() => handleProveedorBlur(index)}
                  placeholder="Buscar proveedor..."
                  list={`proveedores-${index}`}
                />
                <datalist id={`proveedores-${index}`}>
                  {getSuggestions(proveedorSearchText[index]).map((proveedor) => (
                    <option 
                      key={proveedor.proveedor_id} 
                      value={proveedor.nombre}
                    />
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