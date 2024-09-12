import React, { useState, useEffect } from 'react';
import { UserIcon } from '@heroicons/react/outline';

const ClientForm = ({ clients, addClient, onClose }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    projectName: '',
    quoteNumber: '', // Campo para el número de cotización
    status: '',
    startDate: '',
    endDate: ''
  });
  const [clientMatches, setClientMatches] = useState([]);

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
      quoteNumber: '', // Reseteamos el número de cotización
      status: '',
      startDate: '',
      endDate: ''
    });
    setClientMatches([]);
  };

  const handleAddClient = () => {
    const { clientName, email, phone, projectName, quoteNumber, status, startDate, endDate } = formData;
    if (clientName.trim()) {
      addClient(clientName, email, phone, projectName, quoteNumber, status, startDate, endDate);
      setFormData({
        clientName: '',
        email: '',
        phone: '',
        projectName: '',
        quoteNumber: '',
        status: '',
        startDate: '',
        endDate: ''
      });
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
        <UserIcon className="h-6 w-6 text-red-800 mr-2" />
        Nuevo Cliente y Proyecto
      </h2>
      <div className="mb-4">
        <input
          type="text"
          id="clientName"
          placeholder="Nombre del Cliente"
          value={formData.clientName}
          onChange={handleInputChange}
          className="w-full p-3 border border-red-800 rounded-lg bg-white focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition"
        />
        {clientMatches.length > 0 && (
          <ul className="border border-gray-300 rounded-lg mt-2 bg-white shadow-md">
            {clientMatches.map((client, index) => (
              <li
                key={index}
                onClick={() => handleClientSelect(client)}
                className="cursor-pointer hover:bg-gray-100 p-2"
              >
                {client.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-4">
        <input
          type="email"
          id="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-3 border border-red-800 rounded-lg bg-white focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          id="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full p-3 border border-red-800 rounded-lg bg-white focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          id="projectName"
          placeholder="Nombre del Proyecto"
          value={formData.projectName}
          onChange={handleInputChange}
          className="w-full p-3 border border-red-800 rounded-lg bg-white focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          id="quoteNumber"
          placeholder="Número de Cotización"
          value={formData.quoteNumber}
          onChange={handleInputChange}
          className="w-full p-3 border border-red-800 rounded-lg bg-white focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          id="status"
          placeholder="Estado"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full p-3 border border-red-800 rounded-lg bg-white focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition"
        />
      </div>
      <div className="mb-4">
        <input
          type="date"
          id="startDate"
          placeholder="Fecha de Inicio"
          value={formData.startDate}
          onChange={handleInputChange}
          className="w-full p-3 border border-red-800 rounded-lg bg-white focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition"
        />
      </div>
      <div className="mb-4">
        <input
          type="date"
          id="endDate"
          placeholder="Fecha de Fin"
          value={formData.endDate}
          onChange={handleInputChange}
          className="w-full p-3 border border-red-800 rounded-lg bg-white focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800 transition"
        />
      </div>
      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
        >
          Cerrar
        </button>
        <button
          onClick={handleAddClient}
          className="bg-red-800 text-white py-2 px-4 rounded-lg hover:bg-red-900 transition"
        >
          Guardar Cliente y Proyecto
        </button>
      </div>
    </div>
  );
};

export default ClientForm;
