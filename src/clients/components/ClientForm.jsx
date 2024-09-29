import React, { useState, useEffect } from 'react';
import { UserIcon, CheckCircleIcon } from '@heroicons/react/outline';
import { motion, AnimatePresence } from 'framer-motion';

const ClientForm = ({ clients, addClient, onClose }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    projectName: '',
    startDate: '',
    endDate: ''
  });
  const [clientMatches, setClientMatches] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleClientSelect = (client) => {
    setFormData({
      clientName: client.name,
      email: client.email,
      phone: client.phone,
      projectName: '',
      startDate: '',
      endDate: ''
    });
    setClientMatches([]);
  };

  const handleAddClient = () => {
    const { clientName, email, phone, projectName, startDate, endDate } = formData;
    if (clientName.trim()) {
      addClient(clientName, email, phone, projectName, startDate, endDate);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
          <UserIcon className="h-8 w-8 text-red-800 mr-3" />
          Nuevo Cliente y Proyecto
        </h2>
        <div className="space-y-4">
          {['clientName', 'email', 'phone', 'projectName'].map((field) => (
            <div key={field} className="relative">
              <input
                type={field === 'email' ? 'email' : 'text'}
                id={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' \$1')}
                value={formData[field]}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800 transition-all duration-300 ease-in-out"
              />
            </div>
          ))}
      
        </div>
        <div className="flex justify-between mt-8">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cerrar
          </button>
          <button
            onClick={handleAddClient}
            className="bg-red-800 text-white py-2 px-6 rounded-lg hover:bg-red-900 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Guardar Cliente y Proyecto
          </button>
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
            Registrado exitosamente
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ClientForm;