import React, { useState, useEffect } from 'react';
import ClientForm from '../components/ClientForm';
import ClientList from '../components/ClientList';
import ClientSearch from '../components/ClientSearch';
import { useMaterials } from '../../general/MaterialsContext';
import Sidebar from '../../general/Sidebar';
import Header from '../../general/Header';

const Pclient = () => {
  const [clients, setClients] = useState(JSON.parse(localStorage.getItem('clients')) || []);
  const [filteredClients, setFilteredClients] = useState(clients);
  const [materials] = useMaterials();
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
    setFilteredClients(clients);
  }, [clients]);

  const addClient = (name, email, address, phone, jobType) => {
    const materialsForJob = materials.filter(material => material.group === jobType);
    const newClient = { 
      name, 
      email, 
      address, 
      phone, 
      jobType, 
      jobDate: new Date().toLocaleDateString(), 
      materials: materialsForJob, 
      jobs: [{ name: jobType, date: new Date().toLocaleDateString() }] 
    };
    setClients([...clients, newClient]);
  };

  const handleSearch = (nameQuery, phoneQuery, emailQuery) => {
    const filtered = clients.filter(client => 
      (nameQuery === '' || client.name.toLowerCase().includes(nameQuery.toLowerCase())) &&
      (phoneQuery === '' || client.phone.includes(phoneQuery)) &&
      (emailQuery === '' || client.email.toLowerCase().includes(emailQuery.toLowerCase()))
    );
    setFilteredClients(filtered);
  };

  const handleDeleteClient = (index) => {
    const updatedClients = clients.filter((_, i) => i !== index);
    setClients(updatedClients);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex h-screen">
      {isSidebarVisible && <Sidebar className="w-1/4" />}
      <div className={`flex-1 ${isSidebarVisible ? '' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="p-6">
          <div className="tituloClient">
            <h1 className="text-2xl font-bold mb-6">Gestión de Clientes</h1>
          </div>
          <ClientForm addClient={addClient} />
          <h1 className="text-xl font-semibold mt-8">Buscar</h1>
          <ClientSearch onSearch={handleSearch} />
          <ClientList clients={filteredClients} onDeleteClient={handleDeleteClient} />
        </div>
      </div>
    </div>
  );
};

export default Pclient;
