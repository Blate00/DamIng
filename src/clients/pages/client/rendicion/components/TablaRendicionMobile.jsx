const TablaRendicionMobile = ({ 
    items, 
    handleChange, 
    deleteItem, 
    proveedores, 
    handleProveedorChange,
    formatCLP,
    proveedorSearchText,
    handleProveedorInputChange,
    handleProveedorBlur,
    getSuggestions,
    getProveedorDisplayText
  }) => {
    return (
      <div className="md:hidden space-y-4 ">
        {items.map((item, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 space-y-4"
          >
            {/* Fecha */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                <span className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Fecha</span>
                </span>
              </label>
              <input
                type="date"
                value={item.fecha ? item.fecha.split('T')[0] : ''}
                onChange={(e) => handleChange(index, 'fecha', e.target.value)}
                className="w-full bg-transparent text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 transition-all duration-200"
              />
            </div>
  
            {/* Detalle */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                <span className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Detalle</span>
                </span>
              </label>
              <input
                type="text"
                value={item.detalle || ''}
                onChange={(e) => handleChange(index, 'detalle', e.target.value)}
                className="w-full bg-transparent text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 transition-all duration-200"
                placeholder="Ingresa un detalle"
              />
            </div>
  
            {/* Folio */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                <span className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <span>Folio</span>
                </span>
              </label>
              <input
                type="text"
                value={item.folio || ''}
                onChange={(e) => handleChange(index, 'folio', e.target.value)}
                className="w-full bg-transparent text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 transition-all duration-200"
                placeholder="Ingresa el folio"
              />
            </div>
  
            {/* Proveedor */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                <span className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Proveedor</span>
                </span>
              </label>
              <input
                type="text"
                value={getProveedorDisplayText(index, item)}
                onChange={(e) => handleProveedorInputChange(index, e.target.value)}
                onBlur={() => handleProveedorBlur(index)}
                className="w-full bg-transparent text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 transition-all duration-200"
                placeholder="Buscar proveedor..."
                list={`proveedores-mobile-${index}`}
              />
              <datalist id={`proveedores-mobile-${index}`}>
                {getSuggestions(proveedorSearchText[index]).map((proveedor) => (
                  <option key={proveedor.proveedor_id} value={proveedor.nombre} />
                ))}
              </datalist>
            </div>
  
            {/* Documento */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                <span className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Documento</span>
                </span>
              </label>
              <input
                type="text"
                value={item.documento || ''}
                onChange={(e) => handleChange(index, 'documento', e.target.value)}
                className="w-full bg-transparent text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 transition-all duration-200"
                placeholder="Ingresa el documento"
              />
            </div>
  
            {/* Total */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                <span className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Total</span>
                </span>
              </label>
              <input
                type="text"
                value={formatCLP(item.total) || ''}
                onChange={(e) => handleChange(index, 'total', e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-transparent text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg px-3 py-2 transition-all duration-200"
                placeholder="\$0"
              />
            </div>
  
            {/* Acciones */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => deleteItem(index)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default TablaRendicionMobile;