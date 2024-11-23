const TablaMaterialesSeleccionados = ({ materiales, onUpdateCantidad, onRemoveMaterial }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Unitario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subtotal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materiales.map((material) => (
              <tr key={material.material_id}>
                <td className="px-6 py-4 whitespace-nowrap">{material.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{material.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                <input
type="number"
min="1"
step="1"
value={material.cantidad}
onChange={(e) => {
  const value = parseFloat(e.target.value);
  if (!isNaN(value) && value > 0) {
    onUpdateCantidad(material.material_id, value);
  }
}}
className="w-20 border rounded p-1"
/>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Intl.NumberFormat('es-CL', { 
                    style: 'currency', 
                    currency: 'CLP' 
                  }).format(material.current_value)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Intl.NumberFormat('es-CL', { 
                    style: 'currency', 
                    currency: 'CLP' 
                  }).format(material.cantidad * material.current_value)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onRemoveMaterial(material.material_id)}
                    className="text-red-600 hover:text-red-900"
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
    
    export default TablaMaterialesSeleccionados;