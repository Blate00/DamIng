import React, { useState, useEffect } from 'react';
import ClientList from '../components/ClientList';
import ClientForm from '../components/ClientForm';
import Breadcrumb from '../../general/Breadcrumb';
import { supabase } from '../../supabase/client';

const Pclient = () => {
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
    <div>
      <Breadcrumb items={['Inicio', 'Clientes']} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-800 text-white py-2 px-4 rounded-lg hover:bg-red-900 transition"
        >
          Añadir Cliente
        </button>
      </div>
      <ClientList clients={filteredClients} onDeleteClient={handleDeleteClient} />
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <ClientForm clients={clients} addClient={handleAddClient} onClose={() => setIsModalOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default Pclient;
