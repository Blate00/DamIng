import React from 'react';

const TablaRendicion = ({ items, handleChange, agregarFila, editItem, deleteItem }) => {
  const handleTotalChange = (index, value) => {
    handleChange(index, 'total', value);
    if (value !== '' && value !== undefined && value !== null) {
      if (index === items.length - 1) {
        agregarFila();
      }
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
    <div className="rendicion-list">
      {items.map((item, index) => (
        <div key={index} className="rendicion-item border rounded p-4 mb-4 shadow-sm">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">Fecha:</span>
              <input
                type="date"
                className="px-2 py-1 border rounded"
                value={item.fecha}
                onChange={(e) => handleChange(index, 'fecha', e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Detalle:</span>
              <input
                type="text"
                className="px-2 py-1 border rounded"
                value={item.detalle}
                onChange={(e) => handleChange(index, 'detalle', e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Folio:</span>
              <input
                type="text"
                className="px-2 py-1 border rounded"
                value={item.folio}
                onChange={(e) => handleChange(index, 'folio', e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Proveedor:</span>
              <input
                type="text"
                className="px-2 py-1 border rounded"
                value={item.proveedor}
                onChange={(e) => handleChange(index, 'proveedor', e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Documento:</span>
              <input
                type="text"
                className="px-2 py-1 border rounded"
                value={item.documento}
                onChange={(e) => handleChange(index, 'documento', e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total (CLP):</span>
              <input
                type="number"
                className="px-2 py-1 border rounded"
                value={item.total}
                onChange={(e) => handleTotalChange(index, e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={() => handleEdit(index)}
              className="mr-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Editar
            </button>
            <button
              onClick={() => deleteItem(index)}
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TablaRendicion;
