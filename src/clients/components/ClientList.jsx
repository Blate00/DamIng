import React, { useState, useRef, useEffect } from 'react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';

const ClientList = ({ clients, onDeleteClient, loading }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);


  const handleDeleteClient = (clientId) => {
    onDeleteClient(clientId);
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
    <div className="">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#700F23]"></div>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {clients.map((client, index) => (
            <li key={client.client_id} className="flex items-center justify-between py-4 hover:bg-gray-100 p-3 rounded-lg transition-colors duration-200">
              <Link to={`/clients/trabajos/${client.client_id}`} className="flex items-center space-x-4">
                {client.image ? (
                  <img src={client.image} alt={client.name} className="h-12 w-12 rounded-full object-cover border-2 border-gray-300" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-red-600  text-white flex items-center justify-center text-lg font-medium">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                </div>
              </Link>
              <button
                onClick={() => handleDeleteClient(client.client_id)}
                className="text-gray-500 hover:text-red-600 transition-colors duration-200"
              >
               <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6"
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientList;