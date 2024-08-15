import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/outline';

const Archives = () => {
  const { id } = useParams();
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients[id];

  if (!client) {
    return <div className="p-6">Cliente no encontrado</div>;
  }

  const handleDownload = (filename) => {
    alert(`Descargando archivo: ${filename}`);
  };

  return (
    <main className=" uwu flex-1 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-4 h-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{client.name}</h2>

        <ul className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <li>
            <Link to={`/Presupuesto/${id}`} className="flex items-center justify-between w-full bg-gray-50 p-2 rounded-lg hover:bg-red-200 transition-colors cursor-pointer">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-gray-500 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-800">Presupuesto</h3>
                  <p className="text-sm text-gray-500">{`Modificado: ${client.jobDate}`}</p>
                </div>
              </div>
              <button
                onClick={(e) => { 
                  e.preventDefault(); 
                  handleDownload('presupuesto.pdf'); 
                }}
                className="p-2 bg-black text-white rounded-full"
              >
                <DownloadIcon className="h-4 w-4" />
              </button>
            </Link>
          </li>

          <li>
            <Link to={`/Rendicion/${id}`} className="flex items-center justify-between w-full bg-gray-50 p-2 rounded-lg hover:bg-red-200 transition-colors cursor-pointer">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-gray-500 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-800">Rendición</h3>
                  <p className="text-sm text-gray-500">{`Modificado: ${client.jobDate}`}</p>
                </div>
              </div>
              <button
                onClick={(e) => { 
                  e.preventDefault(); 
                  handleDownload('rendicion.pdf'); 
                }}
                className="p-2 bg-black text-white rounded-full"
              >
                <DownloadIcon className="h-4 w-4" />
              </button>
            </Link>
          </li>

          <li>
            <Link to={`/Materiales/${id}`} className="flex items-center justify-between w-full bg-gray-50 p-2 rounded-lg hover:bg-red-200 transition-colors cursor-pointer">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-gray-500 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-800">Listado</h3>
                  <p className="text-sm text-gray-500">{`Modificado: ${client.jobDate}`}</p>
                </div>
              </div>
              <button
                onClick={(e) => { 
                  e.preventDefault(); 
                  handleDownload('listado.pdf'); 
                }}
                className="p-2 bg-black text-white rounded-full"
              >
                <DownloadIcon className="h-4 w-4" />
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
};

export default Archives;
