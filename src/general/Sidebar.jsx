import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UsersIcon, ClipboardListIcon, OfficeBuildingIcon, UserCircleIcon } from '@heroicons/react/outline';
import damLogo from '../assets/dam.jpg';
import ClientForm from '../clients/components/ClientForm';
import { useMaterials } from './MaterialsContext';

const Sidebar = ({ isVisible, closeSidebar }) => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();
  const [clients, setClients] = useState(JSON.parse(localStorage.getItem('clients')) || []);
  const [materials] = useMaterials(); // Asegúrate de tener acceso a `materials`

  // Guardar en localStorage cuando los clientes cambian
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const handleAddClient  = (name, email, address, phone, jobType) => {
    const existingClientIndex = clients.findIndex(client => client.name.toLowerCase() === name.toLowerCase());
    const newJob = { name: jobType, date: new Date().toLocaleDateString() };
  
    let updatedClients;
  
    if (existingClientIndex !== -1) {
      // Si el cliente ya existe, se agrega el nuevo trabajo a su lista de trabajos
      updatedClients = [...clients];
      updatedClients[existingClientIndex].jobs.push(newJob);
      updatedClients[existingClientIndex].jobDate = new Date().toLocaleDateString();
    } else {
      // Si el cliente no existe, se crea uno nuevo con su primer trabajo
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
  
    // Actualizamos el estado y el localStorage
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };
  const navItems = [
    { name: 'Home', path: '/home', icon: HomeIcon },
    { name: 'Clientes', path: '/clients', icon: UsersIcon },
    { name: 'Materiales', path: '/materials', icon: ClipboardListIcon },
    { name: 'Empresa', path: '/company', icon: OfficeBuildingIcon },
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
      {/* Sidebar visible siempre en pantallas medianas y grandes */}
      <div className="hidden bg-gray-100 md:flex md:flex-col md:w-70  ">
        <div className="flex items-center px-4 py-6 ml-2 mt-10 ">
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

        {/* Botón para abrir el modal de añadir proyecto */}
        <button
          className="bg-red-800 text-white p-2 rounded-lg mt-4 ml-3 mr-4 hover:bg-red-900 transition"
          onClick={() => setIsModalOpen(true)}
        >
          Añadir Proyecto
        </button>
      </div>

      {/* Sidebar para pantallas pequeñas */}
      <div
        className={`md:hidden fixed inset-0 bg-gray-900 bg-opacity-50  transition-opacity z-50 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      >
        <div
          className={`h-full w-60 bg-white shadow-md transform transition-transform ${
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
          <button
            className="bg-red-800 text-white p-3 items-center rounded-lg mt-4 hover:bg-red-900 transition"
            onClick={() => setIsModalOpen(true)}
          >
            Añadir Proyecto
          </button>
        </div>
      </div>

      {/* Modal para añadir proyecto */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="bg-white p-8 rounded-lg shadow-lg w-full md:w-3/4 lg:w-2/2"
          >
            <ClientForm clients={clients} addClient={handleAddClient} materials={materials} />
            <button
              className="mt-0 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
              onClick={() => setIsModalOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
