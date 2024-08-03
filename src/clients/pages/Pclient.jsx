// src/pages/Pclient.js
import React, { useState } from 'react';
import ClientForm from '../components/ClientForm';
import ClientList from '../components/ClientList';
import ClientSearch from '../components/ClientSearch';
import { useMaterials } from '../../general/MaterialsContext';

const Pclient = () => {
  const [clients, setClients] = useState([
    {
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      address: "Calle Falsa 123",
      phone: "555-1234",
      jobType: "alimentador",
      materials: [
        { description: "cámaras de registro de 300x300", value: 50 },
        { description: "superflex 4 AWG", value: 30 }
      ]
    },
    {
      name: "María García",
      email: "maria.garcia@example.com",
      address: "Av. Siempreviva 742",
      phone: "555-5678",
      jobType: "empalme",
      materials: [
        { description: "Hormigón", value: 120 },
        { description: "Bifasico 2x40", value: 85 }
      ]
    },
    {
      name: "Carlos Santana",
      email: "carlos.santana@example.com",
      address: "Calle Principal 456",
      phone: "555-8765",
      jobType: "interior bodega",
      materials: [
        { description: "camara de registro 110", value: 45 },
        { description: "barra tierra con prensa 1 metro", value: 50 }
      ]
    },
    {
      name: "Ana Rodríguez",
      email: "ana.rodriguez@example.com",
      address: "Av. Central 789",
      phone: "555-4321",
      jobType: "alimentador",
      materials: [
        { description: "Luz piloto riel din", value: 22 },
        { description: "Borne a tierra autoajustable 4 - 6 mm", value: 18 }
      ]
    }
  ]);

  const [filteredClients, setFilteredClients] = useState(clients);
  const [materials] = useMaterials();

  const addClient = (name, email, address, phone, jobType) => {
    const materialsForJob = materials.filter(material => material.group === jobType);
    const newClient = { name, email, address, phone, jobType, materials: materialsForJob };
    setClients([...clients, newClient]);
    setFilteredClients([...clients, newClient]);
  };

  const handleSearch = (nameQuery, phoneQuery, emailQuery) => {
    const filtered = clients.filter(client => 
      (nameQuery === '' || client.name.toLowerCase().includes(nameQuery.toLowerCase())) &&
      (phoneQuery === '' || client.phone.includes(phoneQuery)) &&
      (emailQuery === '' || client.email.toLowerCase().includes(emailQuery.toLowerCase()))
    );
    setFilteredClients(filtered);
  };

  return (
    <div>
      <h1>Gestión de Clientes</h1>     <ClientForm addClient={addClient} />

      <h1>Buscar</h1>
      <ClientSearch onSearch={handleSearch} />
 
      <ClientList clients={filteredClients} />
    </div>
  );
};

export default Pclient;
