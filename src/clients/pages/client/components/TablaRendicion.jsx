import React from 'react';

const TablaRendicion = ({ items, handleChange, agregarFila, editItem, deleteItem, proveedores }) => {
  const handleTotalChange = (index, value) => {
    handleChange(index, 'total', value);
    if (value !== '' && value !== undefined && value !== null && index === items.length - 1) {
      agregarFila();
    }
  };

  const handleProveedorChange = (index, value) => {
    handleChange(index, 'proveedor', value);
  };

  const handleEdit = (index) => {
    const fecha = prompt("Enter new date:", items[index].fecha);
    const detalle = prompt("Enter new detail:", items[index].detalle);
    const folio = prompt("Enter new folio:", items[index].folio);
    const proveedor = prompt("Enter new provider:", items[index].proveedor);
    const documento = prompt("Enter new document:", items[index].documento);
    const total = prompt("Enter new total:", items[index].total);

    if (fecha && detalle && folio && proveedor && documento && total) {
      editItem(index, { fecha, detalle, folio, proveedor, documento, total });
    }
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    return proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(inputValue)
    );
  };

  return (
    <div className="tabla-rendicion">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 text-center">Fecha</th>
            <th className="py-2 px-4 text-center">Detalle</th>
            <th className="py-2 px-4 text-center">Folio</th>
            <th className="py-2 px-4 text-center">Proveedor</th>
            <th className="py-2 px-4 text-center">Documento</th>
            <th className="py-2 px-4 text-center">Total</th>
            <th className="py-2 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-4">
                <input
                  type="date"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                  value={item.fecha}
                  onChange={(e) => handleChange(index, 'fecha', e.target.value)}
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                  value={item.detalle}
                  onChange={(e) => handleChange(index, 'detalle', e.target.value)}
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                  value={item.folio}
                  onChange={(e) => handleChange(index, 'folio', e.target.value)}
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                  value={item.proveedor}
                  onChange={(e) => handleProveedorChange(index, e.target.value)}
                  list={`proveedores-${index}`}
                />
                <datalist id={`proveedores-${index}`}>
                  {getSuggestions(item.proveedor).map((suggestion, i) => (
                    <option key={i} value={suggestion.nombre} />
                  ))}
                </datalist>
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                  value={item.documento}
                  onChange={(e) => handleChange(index, 'documento', e.target.value)}
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="number"
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                  value={item.total}
                  onChange={(e) => handleTotalChange(index, e.target.value)}
                />
              </td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => deleteItem(index)}
                  className="bg-red-700 text-white px-2 py-1 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={agregarFila}
        className="mt-4 bg-red-700 text-white px-4 py-2 rounded"
      >
        Agregar Fila
      </button>
    </div>
  );
};

export default TablaRendicion;