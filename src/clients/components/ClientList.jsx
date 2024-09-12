import React, { useState, useRef, useEffect } from 'react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';

const ClientList = ({ clients, onDeleteClient }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);

  const handleDotsClick = (index) => {
    setOpenIndex(prevIndex => prevIndex === index ? null : index);
  };

  const handleDeleteClient = (clientId) => {
    onDeleteClient(clientId);
    setOpenIndex(null);
  };

  const handleDownloadFiles = (index) => {
    alert(`Descargar archivos para el cliente ${clients[index].name}`);
    setOpenIndex(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="rounded-lg p- 100 ">
    <div className="rounded-lg ">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Lista de Clientes</h2>
      <ul className="space-y-2">
        {clients.map((client, index) => (
          <li key={client.client_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer relative">
            <Link to={`/clients/trabajos/${client.client_id}`} className="flex items-center w-full space-x-3">
              {client.image ? (
                <img src={client.image} alt={client.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-500 text-white flex items-center justify-center text-lg font-medium">
                  {client.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-md font-semibold text-gray-800">{client.name}</h3>
                <p className="text-sm text-gray-500">Modificado {client.jobDate}</p>
              </div>
            </Link>

            <DotsVerticalIcon
              className="h-6 w-6 text-gray-500 cursor-pointer"
              onClick={() => handleDotsClick(index)}
            />
            {openIndex === index && (
              <div ref={dropdownRef} className="absolute right-2 top-10 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                <button
                  className="block w-full text-left px-3 py-1 text-gray-700 hover:bg-gray-100 text-sm"
                  onClick={() => handleDownloadFiles(index)}
                >
                  Descargar Archivos
                </button>
                <button
                  className="block w-full text-left px-3 py-1 text-red-600 hover:bg-red-100 text-sm"
                  onClick={() => handleDeleteClient(client.client_id)}
                >
                  Eliminar Cliente
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div> </div>
  );
};

export default ClientList;
