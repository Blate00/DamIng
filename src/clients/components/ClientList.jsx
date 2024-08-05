import React, { useState, useEffect, useRef } from 'react';
import { FolderIcon, DotsVerticalIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';

const ClientList = ({ clients, onDeleteClient }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);

  const handleDotsClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleDeleteClient = (index) => {
    onDeleteClient(index);
    setOpenIndex(null);
  };

  const handleDownloadFiles = (index) => {
    // Implementar la lógica para descargar archivos
    alert(`Descargar archivos para el cliente ${clients[index].name}`);
    setOpenIndex(null);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Clientes</h2>
      <ul className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {clients.map((client, index) => (
          <li key={index} className="bg-white p-4 rounded-md shadow-md flex items-center justify-between relative">
            <Link to={`/client/${index}`}>
              <div className="flex items-center">
                <FolderIcon className="h-8 w-8 text-gray-500 mr-4" />
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                  <p className="text-sm text-gray-600">{client.email}</p>
                  <p className="text-sm text-gray-600">{client.phone}</p>
                </div>
              </div>
            </Link>
            <DotsVerticalIcon 
              className="h-6 w-6 text-gray-500 cursor-pointer" 
              onClick={() => handleDotsClick(index)} 
            />
            {openIndex === index && (
              <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleDeleteClient(index)}
                >
                  Eliminar
                </button>
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleDownloadFiles(index)}
                >
                  Descargar Archivos
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;
