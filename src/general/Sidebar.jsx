import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UsersIcon, ClipboardListIcon, OfficeBuildingIcon, UserCircleIcon } from '@heroicons/react/outline';
import damLogo from '../assets/dam.jpg';

const Sidebar = ({ isVisible, closeSidebar }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/home', icon: HomeIcon },
    { name: 'Clientes', path: '/clients', icon: UsersIcon },
    { name: 'Materiales', path: '/materials', icon: ClipboardListIcon },
    { name: 'Empresa', path: '/company', icon: OfficeBuildingIcon },
    { name: 'Cuenta', path: '/account', icon: UserCircleIcon },
    { name: 'Tareas', path: '/tasks', icon: ClipboardListIcon },
  ];

  return (
    <>
      {/* Sidebar visible siempre en pantallas medianas y grandes */}
      <div className="hidden md:flex md:flex-col md:w-70 mt-10 ">
        <div className="flex items-center px-4 py-6 ml-4 ">
          <img src={damLogo} alt="Dam Ingenieria" className="h-10 w-10 mr-2 " />
          <div className="text-lg font-bold">Dam Ingenieria</div>
        </div>
        <ul className="mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name} className="py-1">
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-md ${
                    isActive ? 'bg-red-100 text-black' : 'hover:bg-red-200'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sidebar para pantallas pequeñas */}
      <div
        className={`md:hidden fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity z-50 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      >
        <div
          className={`h-full w-80 bg-white shadow-md transform transition-transform ${
            isVisible ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center px-4 py-6 ">
            <img src={damLogo} alt="Dam Ingenieria" className="h-8 w-8 mr-3" />
            <div className="text-lg font-bold">Dam Ingenieria</div>
          </div>
          <ul className="mt-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name} className="py-2">
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                      isActive ? 'bg-gray-300 text-gray-900' : 'hover:bg-gray-200'
                    }`}
                    onClick={closeSidebar} // Cierra el Sidebar al hacer clic
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
