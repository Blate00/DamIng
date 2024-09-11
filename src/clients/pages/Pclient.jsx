import React, { useState, useEffect, useRef } from 'react';
import ClientList from '../components/ClientList';
import Breadcrumb from '../../general/Breadcrumb';
import { supabase } from '../../supabase/client';  // Asegúrate de que la ruta sea correcta

const Pclient = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedFilter, setSelectedFilter] = useState('Mes');

  // Recuperar datos desde Supabase
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('client_id, name, image, jobDate');  // Ajusta los campos según tu tabla

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

  // Filtrar clientes basado en `selectedPeriod` y `selectedFilter`
  useEffect(() => {
    // Aquí puedes implementar la lógica para filtrar `clients` según `selectedPeriod` y `selectedFilter`
    // Por ahora, simplemente actualizamos `filteredClients` para mostrar todos los clientes
    setFilteredClients(clients);
  }, [clients, selectedPeriod, selectedFilter]);

  const handleDeleteClient = (client_id) => {
    // Elimina cliente por `client_id`
    const updatedClients = clients.filter(client => client.client_id !== client_id);
    setClients(updatedClients);
    setFilteredClients(updatedClients);
  };

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
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg p-100">
        <div className="p-5">
          <Breadcrumb />
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <input
              type="text"
              placeholder="Buscar Cliente"
              className="p-3 border border-black rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-red-600 flex-grow mb-3 md:mb-0"
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
        </div>
        <ClientList clients={filteredClients} onDeleteClient={handleDeleteClient} />
      </div>
    </div>
  );
};

export default Pclient;
