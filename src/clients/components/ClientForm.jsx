import React, { useState } from 'react';
import { UserIcon, MailIcon, PhoneIcon } from '@heroicons/react/outline';

const ClientForm = ({ addClient }) => {
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [jobType, setJobType] = useState('alimentador');

  const handleAddClient = () => {
    if (clientName.trim()) {
      addClient(clientName, email, address, phone, jobType);
      setClientName('');
      setEmail('');
      setAddress('');
      setPhone('');
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
</svg>

        Nuevo Proyecto
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Nombre del Cliente"
          className="p-2 border border-gray-300 rounded"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          className="p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dirección"
          className="p-2 border border-gray-300 rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Teléfono"
          className="p-2 border border-gray-300 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        /><div className="mt-1">
        <select
          className="p-2 border border-gray-300 rounded w-full"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <option value="alimentador">Alimentador</option>
          <option value="empalme">Empalme</option>
          <option value="interior bodega">Interior Bodega</option>
        </select>
      </div>
      <div className="mt-1">
        <button
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
          onClick={handleAddClient}
        >
          Añadir Cliente
        </button>
      </div>
      </div>
      
    </div>
  );
};

export default ClientForm;
