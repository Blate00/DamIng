import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../../general/Sidebar';
import Header from '../../../general/Header';

const Client = () => {
  const { id } = useParams();
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients[id];
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  if (!client) {
    return <div>Cliente no encontrado</div>;
  }

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex h-screen">
      {isSidebarVisible && <Sidebar className="w-1/4" />}
      <div className={`flex-1 ${isSidebarVisible ? '' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="p-6">
          <div className="bg-gray-100 p-6 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">{client.name}</h2>
            <div className="bg-white p-4 rounded-md shadow-md">
           
              <p className="text-sm text-gray-600">Correo Electrónico: {client.email}</p>
              <p className="text-sm text-gray-600">Dirección: {client.address}</p>
              <p className="text-sm text-gray-600">Teléfono: {client.phone}</p>
              <p className="text-sm text-gray-600">Tipo de Trabajo: {client.jobType}</p>
              <h4 className="font-semibold mt-4">Materiales</h4>
              <ul>
                {client.materials.map((material, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {material.description} - Valor: {material.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;
