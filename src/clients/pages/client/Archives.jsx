import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DownloadIcon } from '@heroicons/react/outline';

const Archives = () => {
  const { id } = useParams();
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients[id];

  if (!client) {
    return <div className="p-6">Cliente no encontrado</div>;
  }

  const handleDownload = (filename) => {
    // Implementa la lógica de descarga del archivo
    alert(`Descargando archivo: ${filename}`);
  };

  return (
    <main className="flex-1 p-4 overflow-y-auto ">
      <div className="bg-white  rounded-lg p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{client.name}</h2>

        <div className="space-y-4">
          <Link to={`/Presupuesto/${id}`}>
            <div className="bg-red-50 p-4 rounded-lg shadow-md hover:bg-red-200 transition-colors cursor-pointer flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Presupuesto</h3>
                <p className="text-sm text-gray-500">Modificado: {client.jobDate}</p>
              </div>
              <button
                onClick={() => handleDownload('presupuesto.pdf')}
                className="ml-4 p-2 bg-black text-white rounded-full "
              >
                <DownloadIcon className="h-4 w-4" />
              </button>
            </div>
          </Link>
          
          <Link to={`/Rendicion/${id}`}>
            <div className="bg-red-100 p-4 rounded-lg shadow-md hover:bg-red-300 transition-colors cursor-pointer flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Rendición</h3>
                <p className="text-sm text-gray-500">Modificado: {client.jobDate}</p>
              </div>
              <button
                onClick={() => handleDownload('listado.pdf')}
                className="ml-4 p-2 bg-black text-white rounded-full "
              >
                <DownloadIcon className="h-4 w-4" />
              </button>
            </div>
          </Link>
          <Link to={`/Materiales/${id}`}>
            <div className="bg-red-50 p-4 rounded-lg shadow-md hover:bg-red-200 transition-colors cursor-pointer flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Listado</h3>
                <p className="text-sm text-gray-500">Modificado: {client.jobDate}</p>
              </div>
              <button
                onClick={() => handleDownload('listado.pdf')}
                className="ml-4 p-2 bg-black text-white rounded-full "
              >
                <DownloadIcon className="h-4 w-4" />
              </button>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Archives;
