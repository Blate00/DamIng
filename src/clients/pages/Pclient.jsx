import React, { useState, useEffect } from 'react';
import ClientList from '../components/ClientList';
import ClientForm from '../components/ClientForm';
import Breadcrumb from '../../general/Breadcrumb';
import { supabase } from '../../supabase/client';

const Pclient = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedFilter, setSelectedFilter] = useState('Mes');
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
      // Verificar si el cliente ya existe
      const { data: existingClients, error: fetchError } = await supabase
        .from('clients')
        .select('client_id')
        .eq('name', clientName)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      let clientId;

      if (existingClients) {
        // Cliente ya existe, asignar el proyecto al cliente existente
        clientId = existingClients.client_id;
      } else {
        // Insertar el nuevo cliente
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .insert([{ name: clientName, email, phone_number: phone, project_count: 1 }])
          .select('client_id')
          .single();

        if (clientError || !clientData) {
          throw clientError || new Error('No se pudo insertar el cliente');
        }

        clientId = clientData.client_id;

        // Actualizar la lista de clientes
        setClients(prevClients => [...prevClients, clientData]);
        setFilteredClients(prevClients => [...prevClients, clientData]);
      }

      // Insertar el proyecto
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

      // Eliminar proyectos asociados
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

  return (
    <div className="flex flex-col p-3 bg-white h-full">
    <div className="bg-white h-full rounded-lg">
      <div className="p-5">
      <Breadcrumb items={['Inicio', 'Clientes']} />
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <input
              type="text"
              placeholder="Buscar Cliente"
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-red-800 flex-grow mb-3 md:mb-0"
              // Implementa la lógica de búsqueda si es necesario
            />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="p-2 border border-black rounded-lg shadow-sm mb-3 md:mb-0"
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="p-2 border border-black rounded-lg shadow-sm"
            >
              <option value="Mes">Filtrar por Mes</option>
              <option value="Julio">Julio</option>
              <option value="Agosto">Agosto</option>
            </select>
          </div>
      <div className="flex justify-between items-center mb-4">
      
      </div>
      <ClientList clients={filteredClients} onDeleteClient={handleDeleteClient} />
      
    </div>    </div>    </div>
  );
};

export default Pclient;
