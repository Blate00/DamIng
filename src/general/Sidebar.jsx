import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, UsersIcon, ClipboardListIcon, OfficeBuildingIcon,LogoutIcon, UserCircleIcon, MenuIcon, XIcon, ArrowLeftIcon } from '@heroicons/react/outline';
import ClientForm from '../clients/components/ClientForm';
import { useMaterials } from './MaterialsContext';
import { supabase } from '../supabase/client';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const modalRef = useRef();
  const [materials] = useMaterials();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*');

        if (error) {
          throw error;
        }

        setClients(data);
        setFilteredClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error.message);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    setFilteredClients(clients);
  }, [clients]);

  const handleAddClient = async (clientName, email, phone, projectName, quoteNumber, status, startDate, endDate) => {
    try {
      const { data: existingClients, error: fetchError } = await supabase
        .from('clients')
        .select('client_id')
        .eq('name', clientName);
  
      if (fetchError) {
        throw fetchError;
      }
  
      let clientId;
  
      if (existingClients && existingClients.length > 0) {
        clientId = existingClients[0].client_id;
      } else {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .insert([{ name: clientName, email, phone_number: phone, project_count: 1 }])
          .select('client_id');
  
        if (clientError || !clientData || clientData.length === 0) {
          throw clientError || new Error('No se pudo insertar el cliente');
        }
 
        clientId = clientData[0].client_id;
  
        setClients(prevClients => [...prevClients, clientData[0]]);
        setFilteredClients(prevClients => [...prevClients, clientData[0]]);
      }
  
      const { error: projectError } = await supabase
        .from('projects')
        .insert([{ client_id: clientId, project_name: projectName, quote_number: quoteNumber, status, start_date: startDate, end_date: endDate }]);
  
      if (projectError) {
        throw projectError;
      }
  
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding client and project:', error.message);
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      const { error: clientError } = await supabase
        .from('clients')
        .delete()
        .eq('client_id', clientId);

      if (clientError) {
        throw clientError;
      }

      const { error: projectsError } = await supabase
        .from('projects')
        .delete()
        .eq('client_id', clientId);

      if (projectsError) {
        throw projectsError;
      }

      setClients(prevClients => prevClients.filter(client => client.client_id !== clientId));
      setFilteredClients(prevClients => prevClients.filter(client => client.client_id !== clientId));
    } catch (error) {
      console.error('Error deleting client:', error.message);
    }
  };

  const isActive = (path) => {
    if (path === '/clients') {
      return location.pathname.startsWith('/clients');
    }
    if (path === '/empresa') {
      return location.pathname.startsWith('/empresa');
    }
    return location.pathname === path;
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
  {/* Sidebar */}
  <div className={`fixed inset-y-0 left-0 w-64 bg-[#700F23] text-white transition-all duration-300 ease-in-out transform lg:translate-x-0 ${isOpen ? 'translate-x-0 z-50' : '-translate-x-full'} overflow-y-auto`}>
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-red-900">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="36px" fill="#ffffff" className="transform hover:rotate-180 transition-transform duration-500 cursor-pointer">
            <path d="M720-360v-80h80q17 0 28.5 11.5T840-400q0 17-11.5 28.5T800-360h-80Zm0 160v-80h80q17 0 28.5 11.5T840-240q0 17-11.5 28.5T800-200h-80Zm-160 40q-33 0-56.5-23.5T480-240h-80v-160h80q0-33 23.5-56.5T560-480h120v320H560ZM280-280q-66 0-113-47t-47-113q0-66 47-113t113-47h60q25 0 42.5-17.5T400-660q0-25-17.5-42.5T340-720H200q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h140q58 0 99 41t41 99q0 58-41 99t-99 41h-60q-33 0-56.5 23.5T200-440q0 33 23.5 56.5T280-360h80v80h-80Z"/>
          </svg> 
          <div className="text-2xl font-bold tracking-wide">Dam ING</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow mt-6 px-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active 
                      ? 'bg-white text-red-800 shadow-lg transform scale-105' 
                      : 'text-red-100 hover:bg-red-900 hover:text-white'
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                >
                  <item.icon className={`h-5 w-5 ${active ? 'text-red-800' : 'text-red-200'}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
        <div className="mt-auto p-4">
          <button className="w-full py-2 px-4 bg-red-800 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
            <LogoutIcon className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
    </div>
  </div>
  
  {/* Overlay para cerrar el sidebar en modo responsive */}
  {isOpen && (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
      onClick={toggleSidebar}
    ></div>
  )}

  {/* Contenedor para los botones de navegación en modo teléfono */}
  <div className="fixed bottom-6 left-6 z-50 lg:hidden flex space-x-3">
    {/* Botón para volver a la página anterior */}
    <button
      onClick={() => navigate(-1)}
      className="bg-red-800 text-white p-3 rounded-full shadow-lg hover:bg-red-900 transition-colors duration-200"
    >
      <ArrowLeftIcon className="h-6 w-6" />
    </button>

    {/* Botón para abrir el sidebar */}
    <button
      onClick={toggleSidebar}
      className="bg-red-800 text-white p-3 rounded-full shadow-lg hover:bg-red-900 transition-colors duration-200"
    >
      <MenuIcon className="h-6 w-6" />
    </button>
  </div>

  {/* Modal */}
  {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-96 max-w-md p-6">
        <ClientForm 
          clients={clients} 
          addClient={handleAddClient} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </div>  
  )}

    </>
  );
};

export default Sidebar;