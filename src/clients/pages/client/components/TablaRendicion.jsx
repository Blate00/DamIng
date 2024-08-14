import React from 'react';

const TablaRendicion = ({ items, handleChange, agregarFila }) => {
  // Calcula el total de la tabla
  const totalRendicion = items.reduce((total, item) => total + parseFloat(item.total) || 0, 0);

  // Manejador de cambio en el campo "Total"
  const handleTotalChange = (index, value) => {
    // Actualiza el valor del total
    handleChange(index, 'total', value);
    // Agrega una nueva fila si el campo "Total" no está vacío
    if (value !== '' && value !== undefined && value !== null) {
      // Solo añade una nueva fila si no estamos en la última fila
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
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-2 md:px-4 border">
                <input
                  type="date"
                  value={item.fecha}
                  onChange={(e) => handleChange(index, 'fecha', e.target.value)}
                  className="w-full p-1 border rounded-md text-xs md:text-sm"
                />
              </td>
              <td className="py-2 px-2 md:px-4 border">
                <input
                  type="text"
                  value={item.detalle}
                  onChange={(e) => handleChange(index, 'detalle', e.target.value)}
                  className="w-full p-1 border rounded-md text-xs md:text-sm"
                />
              </td>
              <td className="py-2 px-2 md:px-4 border">
                <input
                  type="text"
                  value={item.folio}
                  onChange={(e) => handleChange(index, 'folio', e.target.value)}
                  className="w-full p-1 border rounded-md text-xs md:text-sm"
                />
              </td>
              <td className="py-2 px-2 md:px-4 border">
                <input
                  type="text"
                  value={item.proveedor}
                  onChange={(e) => handleChange(index, 'proveedor', e.target.value)}
                  className="w-full p-1 border rounded-md text-xs md:text-sm"
                />
              </td>
              <td className="py-2 px-2 md:px-4 border">
                <input
                  type="text"
                  value={item.documento}
                  onChange={(e) => handleChange(index, 'documento', e.target.value)}
                  className="w-full p-1 border rounded-md text-xs md:text-sm"
                />
              </td>
              <td className="py-2 px-2 md:px-4 border">
                <input
                  type="number"
                  value={item.total}
                  onChange={(e) => handleTotalChange(index, parseFloat(e.target.value) || '')}
                  className="w-full p-1 border rounded-md text-xs md:text-sm"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h5 className="text-sm font-medium text-gray-700 mt-4">Total Rendición</h5>
      <p className="text-sm text-gray-600">
        {totalRendicion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
      </p>
    </div>
  );
};

export default TablaRendicion;
