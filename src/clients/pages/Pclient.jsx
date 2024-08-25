import React, { useState, useEffect, useRef } from 'react';
import ClientList from '../components/ClientList';
import { useSearch } from '../../general/SearchContext';
import { useMaterials } from '../../general/MaterialsContext';

const Pclient = () => {
  const [clients, setClients] = useState(JSON.parse(localStorage.getItem('clients')) || []);
  const [filteredClients, setFilteredClients] = useState(clients);
  const [materials] = useMaterials();
  const { searchQuery } = useSearch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedFilter, setSelectedFilter] = useState('Mes');

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
    setFilteredClients(clients);
  }, [clients]);

  useEffect(() => {
    const filtered = clients.filter(client =>
      (searchQuery.name === '' || client.name.toLowerCase().includes(searchQuery.name.toLowerCase())) &&
      (searchQuery.phone === '' || client.phone.includes(searchQuery.phone)) &&
      (searchQuery.email === '' || client.email.toLowerCase().includes(searchQuery.email.toLowerCase()))
    );
    setFilteredClients(filtered);
  }, [searchQuery, clients]);

  const handleDeleteClient = (index) => {
    const updatedClients = clients.filter((_, i) => i !== index);
    setClients(updatedClients);
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
    <div className="flex flex-col p-3">
    <div className="bg-white border  border-black rounded-lg p-4 100">
      <div className=" p-5">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <input
            type="text"
            placeholder="Buscar Cliente"
            className="p-3 border  border-black rounded-lg shadow-sm focus:outline-none focus:ring-1  focus:ring-red-600 flex-grow mb-3 md:mb-0"
          />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-2 border border-black rounded-lg shadow-sm mb-3 md:mb-0"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            {/* Agrega más períodos según sea necesario */}
          </select>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="p-2 border  border-black rounded-lg shadow-sm"
          >
            <option value="Mes">Filtrar por Mes</option>
            <option value="Julio">Julio</option>
            <option value="Agosto">Agosto</option>
            {/* Agrega más filtros según sea necesario */}
          </select>
        </div>
      </div>
      <ClientList clients={filteredClients} onDeleteClient={handleDeleteClient} />
    </div></div>
  );
};

export default Pclient;
