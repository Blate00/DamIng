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

  const handleAddClient = async (clientName, email, phone, projectName, quoteNumber, status, startDate, endDate) => {
    // ... (el resto de la función permanece igual)
  };

  const handleDeleteClient = async (clientId) => {
    // ... (el resto de la función permanece igual)
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