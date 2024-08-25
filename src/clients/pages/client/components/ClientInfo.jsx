import React from 'react';

const ClientInfo = ({ client, job }) => (
  <div className="mb-8 ">
    <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">{client.name}</h2>
    <p className="mt-2 text-gray-900 text-sm md:text-base">
      <span className="font-semibold">Dirección:</span> {client.address}
    </p>
    <p className="mt-2 text-gray-900 text-sm md:text-base">
      <span className="font-semibold">Tipo de Trabajo:</span> {job.name}
    </p>
    <p className="mt-2 text-gray-900 text-sm md:text-base">
      <span className="font-semibold">Fecha del Trabajo:</span> {job.date}
    </p>
  </div>
);

export default ClientInfo;
