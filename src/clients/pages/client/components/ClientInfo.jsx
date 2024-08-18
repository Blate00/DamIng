import React from 'react';

const ClientInfo = ({ client, job }) => (
  <div className="mb-6 text-left">
    <h2 className="text-lg md:text-2xl font-semibold">{client.name}</h2>
    <p className="mt-2 text-gray-500 text-xs md:text-sm">Dirección: {client.address}</p>
    <p className="text-gray-500 text-xs md:text-sm">Tipo de Trabajo: {job.name}</p>
    <p className="text-gray-500 text-xs md:text-sm">Fecha del Trabajo: {job.date}</p>
  </div>
);

export default ClientInfo;
