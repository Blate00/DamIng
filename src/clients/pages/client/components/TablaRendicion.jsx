import React from 'react';

const TablaRendicion = ({ items, handleChange, agregarFila, editItem, deleteItem }) => {
  const handleTotalChange = (index, value) => {
    handleChange(index, 'total', value);
    if (value !== '' && value !== undefined && value !== null && index === items.length - 1) {
      agregarFila();
    }
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

  return (
    <div className="tabla-rendicion ">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <thead className="bg-red-800 border-b border-gray-200">
          <tr>
            <th className="py-2 px-4 text-left text-gray-100">Fecha</th>
            <th className="py-2 px-4 text-left text-gray-100">Detalle</th>
            <th className="py-2 px-4 text-left text-gray-100">Folio</th>
            <th className="py-2 px-4 text-left text-gray-100">Proveedor</th>
            <th className="py-2 px-4 text-left text-gray-100">Documento</th>
            <th className="py-2 px-4 text-left text-gray-100">Total (CLP)</th>
            <th className="py-2 px-4 text-center text-gray-100">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
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
                  onChange={(e) => handleChange(index, 'proveedor', e.target.value)}
                />
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
                  className="px-3 py-1 text-white bg-red-800 rounded hover:bg-red-900"
                >
                  Eliminar
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
