import React, { useState } from 'react';
import axios from 'axios';
import { UserIcon, CalendarIcon, DocumentIcon, StatusOnlineIcon } from '@heroicons/react/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/outline';

const ProjectForm = ({ clientId, client, isOpen, onClose, onProjectAdded }) => {
const initialFormState = {
  projectName: '',
  startDate: '',
  endDate: '',
  status: 'No Iniciado'
};

const [formData, setFormData] = useState(initialFormState);
const [showConfirmation, setShowConfirmation] = useState(false);

// Definición de handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:5000/api/projects', {
      client_id: clientId,
      project_name: formData.projectName,
      start_date: formData.startDate,
      end_date: formData.endDate,
      status: formData.status,
      quote_number: `QN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    });

    if (response.data) {
      onProjectAdded(response.data);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        setFormData(initialFormState);
        onClose();
      }, 2000);
    }
  } catch (error) {
    console.error('Error creating project:', error);
    alert('Error al crear el proyecto: ' + error.response?.data?.error || 'Error desconocido');
  }
};

const inputFields = [
  {
    id: 'clientName',
    icon: UserIcon,
    placeholder: 'Nombre del Cliente',
    value: client?.name || 'Cargando...',
    disabled: true,
    required: true
  },
  {
    id: 'projectName',
    icon: DocumentIcon,
    placeholder: 'Nombre del Proyecto',
    required: true
  },
  {
    id: 'startDate',
    icon: CalendarIcon,
    placeholder: 'Fecha de Inicio',
    type: 'date',
    required: true
  },
  {
    id: 'endDate',
    icon: CalendarIcon,
    placeholder: 'Fecha de Término',
    type: 'date'
  }
];

return (
  <div className={`fixed inset-y-0 right-0 w-96 bg-[#f1f7fc] shadow-2xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-6 border-b border-red-100">
        <h3 className="text-2xl font-bold text-red-800">Nuevo Proyecto</h3>
        <button 
          onClick={() => {
            setFormData(initialFormState);
            onClose();
          }} 
          className="text-red-500 hover:text-red-700 transition-colors duration-200"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {inputFields.map((field) => (
            <div key={field.id} className="relative">
              <div className="relative">
                <input
                  type={field.type || 'text'}
                  id={field.id}
                  placeholder={field.placeholder}
                  value={field.value || formData[field.id] || ''}
                  onChange={(e) => !field.disabled && setFormData(prev => ({
                    ...prev,
                    [field.id]: e.target.value
                  }))}
                  disabled={field.disabled}
                  required={field.required}
                  className={`w-full p-3 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                    field.disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
                <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          ))}

          <div className="relative">
            <div className="relative">
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  status: e.target.value
                }))}
                className="w-full p-3 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              >
                <option value="No Iniciado">No Iniciado</option>
                <option value="Iniciado">Iniciado</option>
                <option value="Finalizado">Finalizado</option>
              </select>
              <StatusOnlineIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </form>
      </div>

      <div className="border-t border-red-100 p-6">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setFormData(initialFormState);
              onClose();
            }}
            className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-md hover:bg-red-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>

    <AnimatePresence>
      {showConfirmation && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center"
        >
          <CheckCircleIcon className="h-6 w-6 mr-2" />
          Proyecto creado exitosamente
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
};

export default ProjectForm;