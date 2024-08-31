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
      <table className="min-w-full bg-white shadow-md  ">
        <thead className="">
          <tr>
            <th className="py-2 px-4 text-center  ">Fecha</th>
            <th className="py-2 px-4 text-center ">Detalle</th>
            <th className="py-2 px-4 text-center ">Folio</th>
            <th className="py-2 px-4 text-center ">Proveedor</th>
            <th className="py-2 px-4 text-center">Documento</th>
            <th className="py-2 px-4 text-center">Total </th>
            <th className="py-2 px-4 text-center ">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className=" border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-4">
                <input
                  type="date"
                  className="w-full px-2 py-1  border-gray-300 rounded"
                  value={item.fecha}
                  onChange={(e) => handleChange(index, 'fecha', e.target.value)}
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  className="w-full px-2 py-1  border-gray-300 rounded"
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
                  className="px-3 py-1 text-white "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-800">
                          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
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
