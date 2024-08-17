import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowSmLeftIcon, MenuIcon } from '@heroicons/react/outline';
import ClientSearch from '../clients/components/ClientSearch'; // Asegúrate de importar ClientSearch

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className="text-gray-700 bg-white p-2 flex items-center shadow-lg ">
      <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-gray-900 p-2">
        <ArrowSmLeftIcon className="h-6 w-6" />
      </button>
      {/* Aquí colocamos el ClientSearch */}
      <div className="flex-grow">
        <ClientSearch />
      </div>
      <div className="ml-auto p-2">
        <button onClick={toggleSidebar} className="text-gray-700 hover:text-gray-900">
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
