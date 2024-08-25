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

  const handleAddClient = (name, email, address, phone, jobType) => {
    const existingClientIndex = clients.findIndex(client => client.name.toLowerCase() === name.toLowerCase());
    const newJob = { name: jobType, date: new Date().toLocaleDateString() };

    let updatedClients;

    if (existingClientIndex !== -1) {
      updatedClients = [...clients];
      updatedClients[existingClientIndex].jobs.push(newJob);
      updatedClients[existingClientIndex].jobDate = new Date().toLocaleDateString();
    } else {
      const materialsForJob = materials.filter(material => material.group === jobType);
      const newClient = {
        name,
        email,
        address,
        phone,
        jobType,
        jobDate: new Date().toLocaleDateString(),
        materials: materialsForJob,
        jobs: [newJob],
      };
      updatedClients = [...clients, newClient];
    }

    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const navItems = [
    { name: 'Inicio', path: '/home', icon: HomeIcon },
    { name: 'Clientes', path: '/clients', icon: UsersIcon },
    { name: 'Materiales', path: '/materials', icon: ClipboardListIcon },
    { name: 'Empresa', path: '/empresa', icon: OfficeBuildingIcon },
    { name: 'Cuenta', path: '/account', icon: UserCircleIcon },
    { name: 'Tareas', path: '/tasks', icon: ClipboardListIcon },
  ];

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModalOpen]);

  return (
    <>
      {/* Sidebar for medium and large screens */}
      <div className="hidden md:flex flex-col w-64 h-full bg-gradient-to-b from-[#700F23] to-[#350A12] text-white">
        <div className="flex items-center px-6 py-8">
        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed"><path d="M720-360v-80h80q17 0 28.5 11.5T840-400q0 17-11.5 28.5T800-360h-80Zm0 160v-80h80q17 0 28.5 11.5T840-240q0 17-11.5 28.5T800-200h-80Zm-160 40q-33 0-56.5-23.5T480-240h-80v-160h80q0-33 23.5-56.5T560-480h120v320H560ZM280-280q-66 0-113-47t-47-113q0-66 47-113t113-47h60q25 0 42.5-17.5T400-660q0-25-17.5-42.5T340-720H200q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h140q58 0 99 41t41 99q0 58-41 99t-99 41h-60q-33 0-56.5 23.5T200-440q0 33 23.5 56.5T280-360h80v80h-80Z"/></svg>          <div className="ml-4 text-xl font-bold">Dam Administración</div>
        </div>

        <ul className="mt-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name} className="mb-4">
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-12 py-3 rounded-md transition-colors ${
                    isActive ? 'bg-[#700F23] text-white border-l-4 border-[white]' : 'hover:bg-[#8B1D34]'
                  }`}
                >
                  <item.icon className="h-6 w-6" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          className="bg-[#700F23] text-[white] p-3 rounded-lg mx-6 mt-8 hover:bg-[black] transition"
          onClick={() => setIsModalOpen(true)}
        >
          Añadir Proyecto
        </button>
      </div>

      {/* Sidebar for small screens */}
      <div
        className={`md:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-50 transition-opacity ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      >
        <div
          className={`w-64 bg-gradient-to-b from-[#700F23] to-[#350A12] text-white h-full shadow-lg transition-transform ${
            isVisible ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center px-6 py-8">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M720-360v-80h80q17 0 28.5 11.5T840-400q0 17-11.5 28.5T800-360h-80Zm0 160v-80h80q17 0 28.5 11.5T840-240q0 17-11.5 28.5T800-200h-80Zm-160 40q-33 0-56.5-23.5T480-240h-80v-160h80q0-33 23.5-56.5T560-480h120v320H560ZM280-280q-66 0-113-47t-47-113q0-66 47-113t113-47h60q25 0 42.5-17.5T400-660q0-25-17.5-42.5T340-720H200q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h140q58 0 99 41t41 99q0 58-41 99t-99 41h-60q-33 0-56.5 23.5T200-440q0 33 23.5 56.5T280-360h80v80h-80Z"/></svg>            <div className="ml-4 text-xl font-bold">Dam Administración</div>
          </div>

          <ul className="mt-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name} className="mb-4">
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-md transition-colors ${
                      isActive ? 'bg-[#89203F] text-white border-l-4 border-[#FFC107]' : 'hover:bg-[#8B1D34]'
                    }`}
                    onClick={closeSidebar}
                  >
                    <item.icon className="h-6 w-6" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            className="bg-[#FFC107] text-[#700F23] p-3 rounded-lg mx-6 mt-8 hover:bg-[#FFB300] transition"
            onClick={() => setIsModalOpen(true)}
          >
            Añadir Proyecto
          </button>
        </div>
      </div>

      {/* Modal for adding project */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="p-8 rounded-lg  w-full md:w-3/4 lg:w-2/3"
          >
            <ClientForm clients={clients} addClient={handleAddClient} materials={materials} />
           
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
