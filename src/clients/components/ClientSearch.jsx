import React, { useState, useEffect } from 'react';
import { UserIcon, MailIcon, PhoneIcon } from '@heroicons/react/outline';

const ClientSearch = ({ onSearch }) => {
  const [queryName, setQueryName] = useState('');
  const [queryPhone, setQueryPhone] = useState('');
  const [queryEmail, setQueryEmail] = useState('');

  useEffect(() => {
    onSearch(queryName, queryPhone, queryEmail);
  }, [queryName, queryPhone, queryEmail, onSearch]);

  return (
    <div className="bg- p-4 rounded-lg mt-4   flex flex-col md:flex-row items-center mb-4">
    <h2>Buscar</h2>
      <div className="flex items-center w-full md:w-1/3 mb-2 md:mb-0 md:mr-2">
        <UserIcon className="h-6 w-6 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Buscar por Nombre"
          className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500"
          value={queryName}
          onChange={(e) => setQueryName(e.target.value)}
        />
      </div>
      <div className="flex items-center w-full md:w-1/3 mb-2 md:mb-0 md:mr-2">
        <PhoneIcon className="h-6 w-6 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Buscar por Teléfono"
          className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500"
          value={queryPhone}
          onChange={(e) => setQueryPhone(e.target.value)}
        />
      </div>
      <div className="flex items-center w-full md:w-1/3">
        <MailIcon className="h-6 w-6 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Buscar por Correo Electrónico"
          className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500"
          value={queryEmail}
          onChange={(e) => setQueryEmail(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ClientSearch;
