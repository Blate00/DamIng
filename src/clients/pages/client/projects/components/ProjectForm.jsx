import React, { useState } from 'react';
import { api, apiConfig } from '../../../../../config/api';

const ProjectForm = ({ clientId, client, isOpen, onClose, onProjectAdded }) => {
  const [formData, setFormData] = useState({
    projectName: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación del formulario
    if (!formData.projectName.trim()) {
      alert('Por favor, ingrese un nombre para el proyecto');
      return;
    }

    try {
      // Crear el objeto de datos
      const projectData = {
        client_id: parseInt(clientId),
        project_name: formData.projectName.trim(),
        status: 'No Iniciado'
      };

      console.log('Enviando datos:', projectData);

      // Uso del endpoint centralizado desde apiConfig
      const response = await api.post(apiConfig.endpoints.projects, projectData);

      if (response.data) {
        onProjectAdded(response.data);
        setFormData({ projectName: '' });
        onClose();
      }
    } catch (error) {
      console.error('Error completo:', error);
      alert(`Error al crear el proyecto: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-[#f1f7fc] shadow-2xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-red-100">
          <h3 className="text-2xl font-bold text-red-800">Nuevo Proyecto</h3>
          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <input
                type="text"
                value={client?.name || 'Cliente no seleccionado'}
                disabled
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Proyecto *
              </label>
              <input
                type="text"
                id="projectName"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
