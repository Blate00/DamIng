import React from 'react';

const ClientFolder = ({ client, materials }) => {
  return (
    <div className="client-folder">
      <h3>{client.firstName} {client.lastName}</h3>
      <p>{client.email}</p>
      <ul>
        {materials.map((material, index) => (
          <li key={index}>{material.name} - {material.category} - ${material.value}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClientFolder;