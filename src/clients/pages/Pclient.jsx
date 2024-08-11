import React, { useState, useEffect, useRef } from 'react';
import ClientForm from '../components/ClientForm';
import ClientList from '../components/ClientList';
import ClientSearch from '../components/ClientSearch';
import { useMaterials } from '../../general/MaterialsContext';

const Pclient = () => {
  const [clients, setClients] = useState(JSON.parse(localStorage.getItem('clients')) || []);
  const [filteredClients, setFilteredClients] = useState(clients);
  const [materials] = useMaterials();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
    setFilteredClients(clients);
  }, [clients]);

  const addClient = (name, email, address, phone, jobType) => {
    const existingClientIndex = clients.findIndex(client => client.name.toLowerCase() === name.toLowerCase());
    const newJob = { name: jobType, date: new Date().toLocaleDateString() };

    if (existingClientIndex !== -1) {
      const updatedClients = [...clients];
      updatedClients[existingClientIndex].jobs.push(newJob);
      updatedClients[existingClientIndex].jobDate = new Date().toLocaleDateString();
      setClients(updatedClients);
    } else {
      const materialsForJob = materials.filter(material => material.group === jobType);
      const newClient = { 
        name, 
        email, 
        address, 
        phone, 
        jobType, 
        jobDate: new Date().toLocaleDateString(), 
        materials: materialsForJob, 
        jobs: [newJob] 
      };
      setClients([...clients, newClient]);
    }
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
    <div className="flex flex-col  bg-white p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Clientes</h1>
      <button
        className="bg-red-800 text-white p-3 rounded-lg mb-4 hover:bg-red-900 transition"
        onClick={() => setIsModalOpen(true)}
      >
        Añadir Proyecto
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="bg-white p-8 rounded-lg shadow-lg w-full md:w-3/4 lg:w-2/2"
          >
            <ClientForm clients={clients} addClient={addClient} materials={materials} />
            <button
              className="mt-0 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
              onClick={() => setIsModalOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      <ClientSearch onSearch={handleSearch} />
      <ClientList clients={filteredClients} onDeleteClient={handleDeleteClient} />
    </div>
  );
};

export default Pclient;
