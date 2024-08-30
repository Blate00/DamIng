import React, { useState, useRef, useEffect } from 'react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';

const RecientClient = ({ clients, onDeleteClient }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);

  const handleDotsClick = (index) => {
    setOpenIndex(prevIndex => prevIndex === index ? null : index);
  };

  const handleDeleteClient = (index) => {
    onDeleteClient(index);
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
    <div className="p-4  w-full">
      <h2 className="text-xl font-semibold mb-4">Proyectos Recientes</h2>
      <ul className="grid grid-cols-1 gap-1">
        {clients.map((client, index) => (
          <li key={index} className="p-2 rounded-lg flex items-center justify-between relative">
            <Link to={`/trabajos/${index}`} className="flex items-center w-full">
              <div className="flex items-center">
                {typeof client.image === 'string' && client.image.startsWith('data:image') ? (
                  <img src={client.image} alt={client.name} className="h-8 w-8 rounded-full mr-2" />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-500 text-white flex items-center justify-center mr-2">
                    {client.image || client.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                </div>
              </div>
            </Link>

      
            {openIndex === index && (
              <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => handleDownloadFiles(index)}
                >
                  Descargar Archivos
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                  onClick={() => handleDeleteClient(index)}
                >
                  Eliminar Cliente
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecientClient;
