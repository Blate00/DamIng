import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClientList from '../components/ClientList';
import ClientForm from '../components/ClientForm';
import Breadcrumb from '../../general/Breadcrumb';
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
      const response = await axios.get('http://localhost:5000/api/clients'); 
      console.log(response.data); // Verifica que sea un array
      setClients(Array.isArray(response.data) ? response.data : []);
      setFilteredClients(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching clients:', error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleAddClient = async (clientName, email, phone, projectName) => {
    try {
      const response = await axios.post('http://localhost:5000/api/clients', {
        clientName,
        email,
        phone,
        projectName
      });
      
      if (response.data) {
        await fetchClients();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding client and project:', error.response?.data?.error || error.message);
      alert('Error al crear el cliente y proyecto: ' + (error.response?.data?.error || 'Error desconocido'));
    }
  };

  const handleDeleteClient = async (clientId) => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.");
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/clients/${clientId}`); // Asegúrate de que esta URL sea correcta
      fetchClients(); // Refetch clients to update the list
    } catch (error) {
      console.error('Error eliminando el cliente:', error.message);
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
          <div className='mt-4 p-6 rounded-lg bg-white shadow-md'>
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pclient;