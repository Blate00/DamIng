import React, { useState, useEffect } from 'react';
import ClientList from '../components/ClientList';
import Breadcrumb from '../../general/Breadcrumb';
import { supabase } from '../../supabase/client';
import { SearchIcon, CalendarIcon, FilterIcon } from '@heroicons/react/outline';

const Pclient = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedFilter, setSelectedFilter] = useState('Mes');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [clients, searchTerm]);

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
        // Primero, obtener todos los task_ids relacionados con estos proyectos
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('task_id')
          .in('project_id', projectIds);
  
        if (tasksError) throw tasksError;
  
        const taskIds = tasksData.map(task => task.task_id);
  
        // Eliminar las asignaciones de tareas
        if (taskIds.length > 0) {
          const { error: taskAssignmentsError } = await supabase
            .from('task_assignments')
            .delete()
            .in('task_id', taskIds);
  
          if (taskAssignmentsError) throw taskAssignmentsError;
        }
  
        // Ahora podemos eliminar las tareas
        const { error: tasksDeleteError } = await supabase
          .from('tasks')
          .delete()
          .in('project_id', projectIds);
  
        if (tasksDeleteError) throw tasksDeleteError;
  
        // Eliminar documentos
        const { error: documentsError } = await supabase
          .from('documents')
          .delete()
          .in('project_id', projectIds);
  
        if (documentsError) throw documentsError;
  
        // Eliminar presupuestos
        const { error: budgetsError } = await supabase
          .from('description_budgets')
          .delete()
          .in('project_id', projectIds);
  
        if (budgetsError) throw budgetsError;
  
        // Eliminar rendiciones
        const { error: rendicionesError } = await supabase
          .from('rendiciones')
          .delete()
          .in('project_id', projectIds);
  
        if (rendicionesError) throw rendicionesError;
      }
  
      if (quoteNumbers.length > 0) {
        // Eliminar asignaciones
        const { error: asignacionError } = await supabase
          .from('asignacion')
          .delete()
          .in('quote_number', quoteNumbers);
  
        if (asignacionError) throw asignacionError;
  
        // Eliminar detalles de rendición
        const { error: detalleRendicionError } = await supabase
          .from('detalle_rendicion')
          .delete()
          .in('quote_number', quoteNumbers);
  
        if (detalleRendicionError) throw detalleRendicionError;
      }
  
      // Eliminar proyectos relacionados
      const { error: projectsDeleteError } = await supabase
        .from('projects')
        .delete()
        .eq('client_id', clientId);
  
      if (projectsDeleteError) throw projectsDeleteError;
  
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
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg">
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
          <div className="flex justify-between items-center mb-4">
            {/* Aquí podrías agregar botones u otros elementos si es necesario */}
          </div>
          <ClientList clients={filteredClients} onDeleteClient={handleDeleteClient} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Pclient;