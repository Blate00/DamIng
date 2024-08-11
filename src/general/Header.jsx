import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowSmLeftIcon, MenuIcon } from '@heroicons/react/outline';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <header className=" text-gray-700 p-2 flex items-center ">
      <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-gray-900 p-2">
        <ArrowSmLeftIcon className="h-6 w-6" />
      </button>
      <h1 className="text-lg font-semibold ml-4">Dam Ingenieria</h1>
      <div className="ml-auto p-2">
        <button onClick={toggleSidebar} className="text-gray-700 hover:text-gray-900">
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
