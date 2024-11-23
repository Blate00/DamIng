import React from 'react';

const ListasMaterialesTable = ({ listas, onListaUpdated }) => {
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
};

return (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr className="bg-gray-50">
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Proyecto
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            N° Cotización
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Materiales
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Dinero
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Fecha Creación
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {listas.map((lista) => (
          <tr key={lista.lista_id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {lista.project_name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {lista.quote_number}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {lista.total_materiales}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {formatCurrency(lista.total_dinero)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {new Date(lista.fecha_creacion).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                onClick={() => {/* Implementar ver detalles */}}
                className="text-red-600 hover:text-red-900 mr-3"
              >
                Ver detalles
              </button>
              <button
                onClick={() => {/* Implementar editar */}}
                className="text-red-600 hover:text-red-900"
              >
                Editar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};

export default ListasMaterialesTable;