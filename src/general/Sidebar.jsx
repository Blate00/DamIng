import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UsersIcon, ClipboardListIcon, OfficeBuildingIcon, UserCircleIcon } from '@heroicons/react/outline';
import ClientForm from '../clients/components/ClientForm';
import { useMaterials } from './MaterialsContext';
import { supabase } from '../supabase/client';

const Sidebar = ({ isVisible, closeSidebar }) => {
  const location = useLocation();
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
      <div className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-[#700F23] to-[#8B1D34] text-white z-40 shadow-lg">
        <div className="flex items-center px-6 py-8 border-b border-[#8B1D34]">
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="40px" fill="#e8eaed" className="transform hover:rotate-180 transition-transform duration-500">
            <path d="M720-360v-80h80q17 0 28.5 11.5T840-400q0 17-11.5 28.5T800-360h-80Zm0 160v-80h80q17 0 28.5 11.5T840-240q0 17-11.5 28.5T800-200h-80Zm-160 40q-33 0-56.5-23.5T480-240h-80v-160h80q0-33 23.5-56.5T560-480h120v320H560ZM280-280q-66 0-113-47t-47-113q0-66 47-113t113-47h60q25 0 42.5-17.5T400-660q0-25-17.5-42.5T340-720H200q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h140q58 0 99 41t41 99q0 58-41 99t-99 41h-60q-33 0-56.5 23.5T200-440q0 33 23.5 56.5T280-360h80v80h-80Z"/>
          </svg> 
          <div className="ml-4 text-2xl font-bold tracking-wide">Dam Dashboard</div>
        </div>
        <nav className="mt-8">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium rounded-r-full transition-all duration-200 ${
                      isActive 
                        ? 'bg-white text-[#700F23] shadow-md transform -translate-x-2' 
                        : 'text-gray-300 hover:bg-[#8B1D34] hover:text-white'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-[#700F23]' : 'text-gray-300'}`} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <button
            className="w-full bg-white text-[#700F23] py-3 rounded-full font-semibold shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#700F23]"
            onClick={() => setIsModalOpen(true)}
          >
            Añadir Proyecto
          </button>
        </div>
      </div>
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