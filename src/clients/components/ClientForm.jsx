import React, { useState, useEffect } from 'react';
import { UserIcon, MailIcon, PhoneIcon } from '@heroicons/react/outline';

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
      addClient(clientName, email, address, phone, jobType);
      setClientName('');
      setEmail('');
      setAddress('');
      setPhone('');
      setJobType('');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <UserIcon className="h-6 w-6 text-gray-700 mr-2" />
        Nuevo Proyecto
      </h2>
      <div className="relative">
        <input
          type="text"
          placeholder="Nombre del Cliente"
          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        {clientMatches.length > 0 && (
          <ul className="absolute bg-white border border-gray-300 rounded mt-1 w-full max-h-60 overflow-auto z-10">
            {clientMatches.map((client, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleClientSelect(client)}
              >
                {client.name}
              </li>
            ))}
          </ul>
        )}   <input
        type="email"
        placeholder="Correo Electrónico"
        className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mt-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Dirección"
        className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mt-4"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Teléfono"
        className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mt-4"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        placeholder="Trabajo"
        className="p-2 border border-gray-300 rounded w- focus:outline-none focus:border-blue-500 mt-2"
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
      />
      </div>  <button
        className="bg-red-800 text-white p-2 rounded  hover:bg-red-900 mt-4"
        onClick={handleAddClient}
      >
        Añadir Cliente
      </button>
   
    
    </div>
  );
};

export default ClientForm;
