import React, { useState, useRef, useEffect } from 'react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';

const ClientList = ({ clients, onDeleteClient, loading }) => {
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Clientes</h1>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#700F23]"></div>
          </div>
        ) : (
          <ul className="space-y-4">
            {clients.map((client, index) => (
              <li key={client.client_id} className="shadow-md flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer relative">
                <Link to={`/clients/trabajos/${client.client_id}`} className="flex  items-center w-full space-x-3">
                  {client.image ? (
                    <img src={client.image} alt={client.name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-[#700F23] text-white flex items-center justify-center text-lg font-medium border-2 border-[#8B1D34]">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-md font-semibold text-gray-800">{client.name}</h3>
                  </div>
                </Link>
<button                   className="text-red-600 hover:text-red-800 transition-colors duration-200"
>
                <svg   onClick={() => handleDeleteClient(client.client_id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
             </button>
                 
           
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ClientList;