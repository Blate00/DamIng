import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UsersIcon, ClipboardListIcon, OfficeBuildingIcon, UserCircleIcon } from '@heroicons/react/outline';
import damLogo from '../assets/dam.png';
import ClientForm from '../clients/components/ClientForm';
import { useMaterials } from './MaterialsContext';

const Sidebar = ({ isVisible, closeSidebar }) => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();
  const [clients, setClients] = useState(JSON.parse(localStorage.getItem('clients')) || []);
  const [materials] = useMaterials();

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [modalRef]);

  const handleAddClient = (name, email, address, phone, jobType) => {
    // Handle adding client
  };

  const navItems = [
    { name: 'Inicio', path: '/home', icon: HomeIcon },
    { name: 'Clientes', path: '/clients', icon: UsersIcon },
    { name: 'Materiales', path: '/materials', icon: ClipboardListIcon },
    { name: 'Empresa', path: '/empresa', icon: OfficeBuildingIcon },
    { name: 'Cuenta', path: '/account', icon: UserCircleIcon },
    { name: 'Tareas', path: '/tasks', icon: ClipboardListIcon },
  ];

  return (
    <>
      {/* Sidebar for all screens */}
      <div className="fixed left-0 top-0 w-64 h-screen bg-[#700F23] text-white z-40">
        <div className="flex items-center px-6 py-8">
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed">
            <path d="M720-360v-80h80q17 0 28.5 11.5T840-400q0 17-11.5 28.5T800-360h-80Zm0 160v-80h80q17 0 28.5 11.5T840-240q0 17-11.5 28.5T800-200h-80Zm-160 40q-33 0-56.5-23.5T480-240h-80v-160h80q0-33 23.5-56.5T560-480h120v320H560ZM280-280q-66 0-113-47t-47-113q0-66 47-113t113-47h60q25 0 42.5-17.5T400-660q0-25-17.5-42.5T340-720H200q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h140q58 0 99 41t41 99q0 58-41 99t-99 41h-60q-33 0-56.5 23.5T200-440q0 33 23.5 56.5T280-360h80v80h-80Z"/>
          </svg> 
          <div className="ml-4 text-xl font-bold">Dam Dashboard</div>
        </div>
        <ul className="mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name} className="mb-1">
                <Link
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    isActive ? 'bg-[#8B1D34] text-white border-l-4 border-[red]' : 'hover:bg-[#8B1D34]'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <button
          className="bg-[#733c46] text-[white] p-3 rounded-lg mx-14 mt-80 hover:bg-[black] transition"
          onClick={() => setIsModalOpen(true)}
        >
          Añadir Proyecto
        </button>
      </div>
      {/* Modal for adding project */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div ref={modalRef} className=" w-72">
            <ClientForm clients={clients} addClient={handleAddClient} materials={materials} />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
