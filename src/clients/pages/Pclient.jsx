import React, { useState, useEffect, useRef } from 'react'; // Asegúrate de importar useState
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
    <div className="flex flex-col p-3 ">
      <div className="uwu2 w-full rounded-lg p-5">
      <ClientList clients={filteredClients} onDeleteClient={handleDeleteClient} /> 
    </div>
</div>  );
};

export default Pclient;