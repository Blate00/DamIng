import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DotsVerticalIcon } from '@heroicons/react/outline';

const ListadoTrabajos = () => {
  const { id } = useParams();
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients[id];
  const [openIndex, setOpenIndex] = useState(null);

  if (!client) {
    return <div className="p-6">Cliente no encontrado</div>;
  }

  const handleDotsClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleDelete = (jobIndex) => {
    // Implementa la lógica de eliminación de trabajo
    alert(`Eliminar trabajo: ${client.jobs[jobIndex].name}`);
    setOpenIndex(null);
  };

  const handleDownload = (jobIndex) => {
    // Implementa la lógica de descarga de archivos
    alert(`Descargar archivos para el trabajo: ${client.jobs[jobIndex].name}`);
    setOpenIndex(null);
  };

  return (
    <div className="flex h-screen p-6 bg-red-200">
      <div className="bg-white shadow-md rounded-lg p-6 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{client.name}</h2>
        <ul className="space-y-0">
          {client.jobs.map((job, index) => (
            <li key={index} className=" p-4 rounded-lg shadow-md flex items-center justify-between relative hover:bg-red-200 transition-colors">
              <Link to={`/archives/${id}`} className="flex-grow">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{job.name}</h3>
                  <p className="text-sm text-gray-500">Modificado: {job.date}</p>
                </div>
              </Link>
              <div className="relative">
                <DotsVerticalIcon
                  className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
                  onClick={() => handleDotsClick(index)}
                />
                {openIndex === index && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(index)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                      onClick={() => handleDownload(index)}
                    >
                      Descargar Archivos
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListadoTrabajos;
