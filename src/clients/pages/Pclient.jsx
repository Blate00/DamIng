import React, { useState, useEffect } from 'react';
import ClientList from '../components/ClientList';
import ClientForm from '../components/ClientForm';
import Breadcrumb from '../../general/Breadcrumb';
import { supabase } from '../../supabase/client';
import { SearchIcon, CalendarIcon, FilterIcon, PlusIcon } from '@heroicons/react/outline';

const Pclient = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedFilter, setSelectedFilter] = useState('Mes');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [clients, searchTerm]);

  const fetchClients = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

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
        .insert([{ 
          client_id: clientId, 
          project_name: projectName, 
          quote_number: quoteNumber, 
          status, 
          start_date: startDate, 
          end_date: endDate 
        }]);
  
      if (projectError) {
        throw projectError;
      }
  
      setIsModalOpen(false);
      fetchClients(); // Refetch clients to update the list
    } catch (error) {
      console.error('Error adding client and project:', error.message);
    }
  };

  const handleDeleteClient = async (clientId) => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.");
    if (!isConfirmed) return;
  
    try {
      // Obtener todos los project_ids y quote_numbers relacionados con este cliente
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('project_id, quote_number')
        .eq('client_id', clientId);
  
      if (projectsError) throw projectsError;
  
      const projectIds = projectsData.map(project => project.project_id);
      const quoteNumbers = projectsData.map(project => project.quote_number);
  
      if (projectIds.length > 0) {
        // Eliminar tareas, documentos, presupuestos y rendiciones relacionados con los proyectos
        await Promise.all([
          supabase.from('tasks').delete().in('project_id', projectIds),
          supabase.from('documents').delete().in('project_id', projectIds),
          supabase.from('description_budgets').delete().in('project_id', projectIds),
          supabase.from('rendiciones').delete().in('project_id', projectIds),
        ]);
      }
  
      if (quoteNumbers.length > 0) {
        // Eliminar asignaciones y detalles de rendición relacionados con los números de cotización
        await Promise.all([
          supabase.from('asignacion').delete().in('quote_number', quoteNumbers),
          supabase.from('detalle_rendicion').delete().in('quote_number', quoteNumbers),
        ]);
      }
  
      // Eliminar proyectos relacionados
      await supabase.from('projects').delete().eq('client_id', clientId);
  
      // Finalmente, eliminar el cliente
      const { error: clientError } = await supabase
        .from('clients')
        .delete()
        .eq('client_id', clientId);
  
      if (clientError) throw clientError;
  
      // Actualizar el estado local
      setClients((prevClients) => prevClients.filter(client => client.client_id !== clientId));
      setFilteredClients((prevFilteredClients) => prevFilteredClients.filter(client => client.client_id !== clientId));
  
      console.log('Cliente eliminado exitosamente');
      // Aquí puedes agregar una notificación de éxito para el usuario
    } catch (error) {
      console.error('Error eliminando el cliente:', error.message);
      // Aquí puedes agregar una notificación de error para el usuario
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="rounded-lg">
        <div className="p-5">
          <Breadcrumb items={['Inicio', 'Clientes']} />
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-2">
            <div className="relative flex-grow mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Buscar Cliente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#700F23] transition duration-150 ease-in-out"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative mb-4 md:mb-0">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#700F23] transition duration-150 ease-in-out"
              >
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </select>
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative mb-4 md:mb-0">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="appearance-none w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#700F23] transition duration-150 ease-in-out"
              >
                <option value="Mes">Filtrar por Mes</option>
                <option value="Julio">Julio</option>
                <option value="Agosto">Agosto</option>
              </select>
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className='mt-4 p-6 rounded-lg bg-white  shadow-md'>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-colors duration-200 flex items-center"
            >
              <PlusIcon className="h-5 w-5" />
            
            </button>
          </div>
          <ClientList 
            clients={filteredClients} 
            onDeleteClient={handleDeleteClient}
            loading={loading} 
          />
          <ClientForm 
            clients={clients}
            addClient={handleAddClient}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          /></div>
        </div>
      </div>
    </div>
  );
};

export default Pclient;