import React, { useEffect } from 'react';

const TablaMaterialesSeleccionados = ({ materiales, onUpdateCantidad, onRemoveMaterial }) => {
// Validación y logging inicial
useEffect(() => {
  console.log('TablaMaterialesSeleccionados - materiales recibidos:', materiales);
  if (!Array.isArray(materiales)) {
    console.error('Error: materiales no es un array:', materiales);
  }
  if (materiales?.length > 0) {
    console.log('Primer material como ejemplo:', materiales[0]);
  }
}, [materiales]);

// Función auxiliar para validar la estructura del material
const isMaterialValid = (material) => {
  const requiredFields = ['material_id', 'description', 'category', 'cantidad', 'precio_unitario'];
  return requiredFields.every(field => material.hasOwnProperty(field));
};

// Función para formatear moneda
const formatCurrency = (amount) => {
  try {
    return new Intl.NumberFormat('es-CL', { 
      style: 'currency', 
      currency: 'CLP' 
    }).format(amount);
  } catch (error) {
    console.error('Error al formatear moneda:', error);
    return '$ 0';
  }
};

// Validación de props
if (!Array.isArray(materiales)) {
  console.error('materiales no es un array');
  return <div>Error: Formato de datos inválido</div>;
}

if (!onUpdateCantidad || typeof onUpdateCantidad !== 'function') {
  console.error('onUpdateCantidad no es una función');
  return <div>Error: Configuración inválida</div>;
}

if (!onRemoveMaterial || typeof onRemoveMaterial !== 'function') {
  console.error('onRemoveMaterial no es una función');
  return <div>Error: Configuración inválida</div>;
}

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
        {materiales.length > 0 ? (
          materiales.map((material) => {
            // Validar cada material antes de renderizar
            if (!isMaterialValid(material)) {
              console.error('Material inválido:', material);
              return null;
            }

            const subtotal = material.cantidad * material.precio_unitario;

            return (
              <tr key={material.material_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {material.description || 'Sin descripción'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {material.category || 'Sin categoría'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={material.cantidad}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        console.log(`Actualizando cantidad para material ${material.material_id} a ${value}`);
                        onUpdateCantidad(material.material_id, value);
                      }
                    }}
                    className="w-20 border rounded p-1"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatCurrency(material.precio_unitario)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatCurrency(subtotal)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      console.log(`Eliminando material ${material.material_id}`);
                      onRemoveMaterial(material.material_id);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
              No hay materiales seleccionados.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
};

export default TablaMaterialesSeleccionados;