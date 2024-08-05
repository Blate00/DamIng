import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, UsersIcon, ClipboardListIcon, OfficeBuildingIcon, UserCircleIcon } from '@heroicons/react/outline';
import damLogo from '../assets/dam.jpg';

const Sidebar = () => {
  return (
    <div className="Sidebar h-full w-64 bg-gray-100 shadow-md">
      <div className="flex items-center justify-center py-6">
        <img src={damLogo} alt="Dam Ingenieria" className="h-16" />
      </div>
      <div className="text-center text-xl font-bold py-4">Dam Ingenieria</div>
      <ul className="mt-10">
        <li className="py-2">
          <Link to="/home" className="flex items-center space-x-2 px-4 hover:bg-gray-200">
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </Link>
        </li>
        <li className="py-2">
          <Link to="/clients" className="flex items-center space-x-2 px-4 hover:bg-gray-200">
            <UsersIcon className="h-5 w-5" />
            <span>Clientes</span>
          </Link>
        </li>
        <li className="py-2">
          <Link to="/materials" className="flex items-center space-x-2 px-4 hover:bg-gray-200">
            <ClipboardListIcon className="h-5 w-5" />
            <span>Materiales</span>
          </Link>
        </li>
        <li className="py-2">
          <Link to="/company" className="flex items-center space-x-2 px-4 hover:bg-gray-200">
            <OfficeBuildingIcon className="h-5 w-5" />
            <span>Empresa</span>
          </Link>
        </li>
        <li className="py-2">
          <Link to="/account" className="flex items-center space-x-2 px-4 hover:bg-gray-200">
            <UserCircleIcon className="h-5 w-5" />
            <span>Cuenta</span>
          </Link>
        </li>
        <li className="py-2">
          <Link to="/account" className="flex items-center space-x-2 px-4 hover:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
</svg>

            <span>Tareas</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
