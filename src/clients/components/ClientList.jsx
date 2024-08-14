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
    <div className="rounder-lg  p-1 rounded-lg mt-4">
      <h2 className="text-xl font-semibold mb-4"></h2>
      <ul className="grid grid-cols-1 md:grid-cols-1 gap-2">
        {clients.map((client, index) => (
          <li key={index} className="bg-gray-50 p-2 rounded-lg flex items-center justify-between relative">
            <Link to={`/trabajos/${index}`} className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <FolderIcon className="h-8 w-8 text-gray-500 mr-2" />
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                </div>
              </div>
              <div>
                <h3 className="ultmod opacity-25">{`modificado ${client.jobDate}`}</h3>
              </div>
            </Link>

            <DotsVerticalIcon
              className="h-6 w-6 text-gray-500 cursor-pointer"
              onClick={() => handleDotsClick(index)}
            />
            {openIndex === index && (
              <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
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
