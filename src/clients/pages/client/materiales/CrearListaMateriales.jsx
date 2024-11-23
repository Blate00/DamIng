import React, { useState } from 'react';
import axios from 'axios';

const CrearListaMateriales = ({ isOpen, onClose, onListaCreated, materiales, projects }) => {
const [formData, setFormData] = useState({
  project_id: '',
  items: [{ material_id: '', cantidad: '', precio_unitario: '' }]
});

const handleAddItem = () => {
  setFormData({
    ...formData,
    items: [...formData.items, { material_id: '', cantidad: '', precio_unitario: '' }]
  });
};

const handleRemoveItem = (index) => {
  const newItems = formData.items.filter((_, i) => i !== index);
  setFormData({ ...formData, items: newItems });
};

const handleItemChange = (index, field, value) => {
  const newItems = [...formData.items];
  newItems[index][field] = value;

  if (field === 'material_id') {
    const material = materiales.find(m => m.material_id === parseInt(value));
    if (material) {
      newItems[index].precio_unitario = material.current_value;
    }
  }

  setFormData({ ...formData, items: newItems });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:5000/api/lista-materiales', formData);
    onListaCreated(response.data);
    onClose();
  } catch (error) {
    console.error('Error creando lista:', error);
  }
};

if (!isOpen) return null;

return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Nueva Lista de Materiales</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Proyecto</label>
          <select
            value={formData.project_id}
            onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            required
          >
            <option value="">Seleccione un proyecto</option>
            {projects.map(project => (
              <option key={project.project_id} value={project.project_id}>
                {project.project_name} ({project.quote_number})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="flex gap-4 items-center">
              <select
                value={item.material_id}
                onChange={(e) => handleItemChange(index, 'material_id', e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                required
              >
                <option value="">Seleccione un material</option>
                {materiales.map(material => (
                  <option key={material.material_id} value={material.material_id}>
                    {material.description} ({material.category})
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={item.cantidad}
                onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                placeholder="Cantidad"
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                required
              />

              <input
                type="number"
                value={item.precio_unitario}
                onChange={(e) => handleItemChange(index, 'precio_unitario', e.target.value)}
                placeholder="Precio unitario"
                className="w-32 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                required
              />

              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleAddItem}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            + Agregar material
          </button>

          <div className="space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Guardar Lista
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
);
};

export default CrearListaMateriales;