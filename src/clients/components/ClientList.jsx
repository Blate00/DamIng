import React from 'react';
import { FolderIcon, DotsVerticalIcon } from '@heroicons/react/outline';

const ClientList = ({ clients }) => (
  <div className="bg-gray-100 p-6 rounded-md shadow-md">
    <h2 className="text-lg font-semibold mb-4">Clientes</h2>
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {clients.map((client, index) => (
        <li key={index} className="bg-white p-4 rounded-md shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <FolderIcon className="h-8 w-8 text-gray-500 mr-4" />
            <div>
              <h3 className="font-semibold">{client.name}</h3>
              <p className="text-sm text-gray-600">{client.email}</p>
              <p className="text-sm text-gray-600">{client.phone}</p>
            </div>
          </div>
          <DotsVerticalIcon className="h-6 w-6 text-gray-500 cursor-pointer" />
        </li>
      ))}
    </ul>
  </div>
);

export default ClientList;
