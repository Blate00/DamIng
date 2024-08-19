import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowSmLeftIcon, MenuIcon } from '@heroicons/react/outline';
import ClientSearch from '../clients/components/ClientSearch'; // Asegúrate de importar ClientSearch

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className="text-gray-700 bg-[#700F23] h-16 p-2 flex items-center shadow-lg ">

      {/* Aquí colocamos el ClientSearch */}
      <div className="flex-grow">
        <ClientSearch />
      </div>
      <div className="ml-auto p-2">
        <button onClick={toggleSidebar} className="text-white hover:text-white">
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
