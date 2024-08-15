import React from 'react';

const TablaRendicion = ({ items, handleChange, agregarFila }) => {
  // Manejador de cambio en el campo "Total"
  const handleTotalChange = (index, value) => {
    handleChange(index, 'total', value);
    // Agrega una nueva fila si el campo "Total" no está vacío
    if (value !== '' && value !== undefined && value !== null) {
      if (index === items.length - 1) {
        agregarFila();
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-red-900 text-white">
          <tr>
            <th className="py-2 px-2 md:px-4 border text-xs md:text-base">Fecha</th>
            <th className="py-2 px-2 md:px-4 border text-xs md:text-base">Detalle</th>
            <th className="py-2 px-2 md:px-4 border text-xs md:text-base">Folio</th>
            <th className="py-2 px-2 md:px-4 border text-xs md:text-base">Proveedor</th>
            <th className="py-2 px-2 md:px-4 border text-xs md:text-base">Documento</th>
            <th className="py-2 px-2 md:px-4 border text-xs md:text-base">Total (CLP)</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {items.map((item, index) => (
            <tr key={index}>
              <td className="py-2 px-2 md:px-4 border">
                <input
                  type="date"
                  className="w-full px-2 py-1 text-xs md:text-base border rounded"
                  value={item.fecha}
                  onChange={(e) => handleChange(index, 'fecha', e.target.value)}
                />
              </td>
              <td className="py-2 px-2 md:px-4 border">
                <input
                  type="text"
                  className="w-full px-2 py-1 text-xs md:text-base border rounded"
                  value={item.detalle}
                  onChange={(e) => handleChange(index, 'detalle', e.target.value)}
                />
              </td>
              <td className="py-2 px-2 md:px-4 border">
                <input
                  type="text"
                  className="w-full px-2 py-1 text-xs md:text-base border rounded"
                  value={item.folio}
                  onChange={(e) => handleChange(index, 'folio', e.target.value)}
                />
              </td>
              <td className="py-2 px-2 md:px-4 border">
                <input
                  type="text"
                  className="w-full px-2 py-1 text-xs md:text-base border rounded"
                  value={item.proveedor}
                  onChange={(e) => handleChange(index, 'proveedor', e.target.value)}
                />
              </td>
              <td className="py-2 px-2 md:px-4 border">
                <input
                  type="text"
                  className="w-full px-2 py-1 text-xs md:text-base border rounded"
                  value={item.documento}
                  onChange={(e) => handleChange(index, 'documento', e.target.value)}
                />
              </td>
              <td className="py-2 px-2 md:px-4 border">
                <input
                  type="number"
                  className="w-full px-2 py-1 text-xs md:text-base border rounded"
                  value={item.total}
                  onChange={(e) => handleTotalChange(index, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaRendicion;
