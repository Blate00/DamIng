import React, { useState, useEffect } from 'react';
import { UserIcon } from '@heroicons/react/outline';

const ClientForm = ({ clients, addClient }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    address: '',
    phone: '',
    jobType: '',
    clientImage: null
  });
  const [clientMatches, setClientMatches] = useState([]);

  useEffect(() => {
    if (formData.clientName.trim()) {
      setClientMatches(
        clients.filter(client =>
          client.name.toLowerCase().includes(formData.clientName.toLowerCase())
        )
      );
    } else {
      setClientMatches([]);
    }
  }, [formData.clientName, clients]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFormData(prevState => ({ ...prevState, clientImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleClientSelect = (client) => {
    setFormData({
      clientName: client.name,
      email: client.email,
      address: client.address,
      phone: client.phone,
      jobType: '',
      clientImage: client.image || client.name.charAt(0).toUpperCase()
    });
    setClientMatches([]);
  };

  const handleAddClient = () => {
    const { clientName, email, address, phone, jobType, clientImage } = formData;
    if (clientName.trim()) {
      addClient(clientName, email, address, phone, jobType, clientImage);
      setFormData({
        clientName: '',
        email: '',
        address: '',
        phone: '',
        jobType: '',
        clientImage: null
      });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <UserIcon className="h-6 w-6 text-gray-700 mr-2" />
        Nuevo Proyecto
      </h2>
      <div className="mb-4">
        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
          Nombre del Cliente
        </label>
        <input
          type="text"
          id="clientName"
          value={formData.clientName}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
        />
        {clientMatches.length > 0 && (
          <ul className="border border-gray-300 rounded-md mt-2">
            {clientMatches.map((client, index) => (
              <li
                key={index}
                onClick={() => handleClientSelect(client)}
                className="cursor-pointer hover:bg-gray-200 p-2"
              >
                {client.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="clientImage" className="block text-sm font-medium text-gray-700">
          Imagen del Cliente
        </label>
        <input
          type="file"
          id="clientImage"
          onChange={handleImageUpload}
          className="mt-1 block w-full text-sm text-gray-500"
          accept="image/*"
        />
      </div>
      {['email', 'address', 'phone', 'jobType'].map(field => (
        <div key={field} className="mb-4">
          <label htmlFor={field} className="block text-sm font-medium text-gray-700">
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            type={field === 'email' ? 'email' : 'text'}
            id={field}
            value={formData[field]}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>
      ))}
      <div className="flex justify-end">
        <button
          onClick={handleAddClient}
          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
        >
          Guardar Proyecto
        </button>
      </div>
    </div>
  );
};

export default ClientForm;
