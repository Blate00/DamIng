import React, { useState, useEffect } from 'react';
import { UserIcon } from '@heroicons/react/outline';

const ClientForm = ({ clients, addClient, materials }) => {
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [jobType, setJobType] = useState('');
  const [clientMatches, setClientMatches] = useState([]);

  useEffect(() => {
    if (clientName.trim() === '') {
      setClientMatches([]);
      return;
    }

    const matches = clients.filter(client =>
      client.name.toLowerCase().includes(clientName.toLowerCase())
    );
    setClientMatches(matches);
  }, [clientName, clients]);

  const handleClientSelect = (client) => {
    setClientName(client.name);
    setEmail(client.email);
    setAddress(client.address);
    setPhone(client.phone);
    setClientMatches([]);
  };

  const handleAddClient = () => {
    if (clientName.trim()) {
      // Agregar el cliente a la lista de clientes en localStorage
      const newClient = { clientName, email, address, phone, jobType };
      const savedClients = JSON.parse(localStorage.getItem('clients')) || [];
      savedClients.push(newClient);
      localStorage.setItem('clients', JSON.stringify(savedClients));

      addClient(clientName, email, address, phone, jobType);
      setClientName('');
      setEmail('');
      setAddress('');
      setPhone('');
      setJobType('');
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
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
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
      {/* ...otros campos... */}
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
