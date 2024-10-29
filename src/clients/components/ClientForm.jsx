import React, { useState, useEffect } from 'react';
import { UserIcon, CheckCircleIcon, MailIcon, PhoneIcon, DocumentIcon } from '@heroicons/react/outline';
import { motion, AnimatePresence } from 'framer-motion';

const ClientForm = ({ clients = [], addClient, isOpen, onClose }) => {
  const initialFormState = {
    clientName: '',
    email: '',
    phone: '',
    projectName: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [clientMatches, setClientMatches] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormState);
      setClientMatches([]);
      setShowConfirmation(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.clientName.trim()) {
      const matches = clients.filter(client =>
        client.name.toLowerCase().includes(formData.clientName.toLowerCase())
      );
      if (matches.length === 1 && matches[0].name.toLowerCase() === formData.clientName.toLowerCase()) {
        handleClientSelect(matches[0]);
      } else {
        setClientMatches(matches);
      }
    } else {
      setClientMatches([]);
    }
  }, [formData.clientName, clients]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value || ''
    }));
  };

  const handleClientSelect = (client) => {
    setFormData({
      clientName: client.name || '',
      email: client.email || '',
      phone: client.phone_number || '',
      projectName: formData.projectName || '' // Mantener el valor actual del proyecto
    });
    setClientMatches([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { clientName, email, phone, projectName } = formData;
    if (clientName.trim()) {
      await addClient(clientName, email, phone, projectName);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        setFormData(initialFormState);
        onClose();
      }, 2000);
    }
  };

  const inputFields = [
    { 
      id: 'clientName', 
      icon: UserIcon, 
      placeholder: 'Nombre del Cliente',
      required: true
    },
    { 
      id: 'email', 
      icon: MailIcon, 
      placeholder: 'Correo Electrónico', 
      type: 'email'
    },
    { 
      id: 'phone', 
      icon: PhoneIcon, 
      placeholder: 'Teléfono'
    },
    { 
      id: 'projectName', 
      icon: DocumentIcon, 
      placeholder: 'Nombre del Proyecto',
      required: true
    }
  ];

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-[#f1f7fc] shadow-2xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-red-100">
          <h3 className="text-2xl font-bold text-red-800">Nuevo Cliente</h3>
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
                <input
                  type={field.type || 'text'}
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={handleInputChange}
                  required={field.required}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                />
              </div>
            ))}
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
            Cliente y proyecto registrados exitosamente
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientForm;