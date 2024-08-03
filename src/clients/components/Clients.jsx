import React, { useState } from 'react';
import NewClient from './NewClient';
import ClientFolder from './ClientFolder';

const Clients = () => {
  const [clients, setClients] = useState([]);

  const addClient = (client) => {
    setClients([...clients, client]);
  };

  return (
    <div className="clients">
      <NewClient addClient={addClient} />
      {clients.map((client, index) => (
        <ClientFolder key={index} client={client} />
      ))}
    </div>
  );
};

export default Clients;
