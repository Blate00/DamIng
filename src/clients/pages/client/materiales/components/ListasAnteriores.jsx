
// ListasAnteriores.jsx (Nuevo componente)
const ListasAnteriores = ({ listas, onSelectLista }) => {
    return (
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total Materiales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total Dinero
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {listas.map((lista) => (
              <tr key={lista.lista_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(lista.fecha_creacion).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lista.total_materiales}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Intl.NumberFormat('es-CL', { 
                    style: 'currency', 
                    currency: 'CLP' 
                  }).format(lista.total_dinero)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onSelectLista(lista)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    };
    
    export default ListasAnteriores;