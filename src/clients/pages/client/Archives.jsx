import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/outline';
import Breadcrumb from '../../../general/Breadcrumb'; 

const Archives = () => {
  const { id, jobIndex } = useParams(); // Obtén el ID del cliente y el índice del trabajo
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients.find((client, index) => index === parseInt(id)); // Encuentra el cliente por ID

  if (!client) {
    return <div className="p-6 text-center text-gray-500">Cliente no encontrado</div>;
  }

  const job = client.jobs && client.jobs[parseInt(jobIndex)]; // Obtén el trabajo específico por índice
  if (!job) {
    return <div className="p-6 text-center text-gray-500">Trabajo no encontrado</div>;
  }

  const handleDownload = (filename) => {
    alert(`Descargando archivo: ${filename}`);
  };

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg">
        <div className="p-5">
          <Breadcrumb />
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Documentos del Trabajo: {job.name}</h2>
          <ul className="space-y-2">
            <li>
              {/* Redirigir con ambos parámetros: id y jobIndex */}
              <Link to={`/clients/Presupuesto/${id}/${jobIndex}`} className="flex mb-2 items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-red-600 mr-4" />
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">Presupuesto</h3>
                    <p className="text-sm text-gray-500">{`Modificado: ${job.date}`}</p>
                  </div>
                </div>
                <DownloadIcon
                  className="h-6 w-6 text-gray-800 cursor-pointer hover:text-blue-800"
                  onClick={() => handleDownload('Presupuesto')}
                />
              </Link>
              <Link to={`/clients/rendicion/${id}/${jobIndex}`} className="flex mb-2 items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-red-600 mr-4" />
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">Rendición</h3>
                    <p className="text-sm text-gray-500">{`Modificado: ${job.date}`}</p>
                  </div>
                </div>
                <DownloadIcon
                  className="h-6 w-6 text-gray-800 cursor-pointer hover:text-blue-800"
                  onClick={() => handleDownload('Presupuesto')}
                />
              </Link>
              <Link to={`/clients/flujo/${id}/${jobIndex}`} className="flex mb-2 items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-red-600 mr-4" />
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">Flujo de Caja</h3>
                    <p className="text-sm text-gray-500">{`Modificado: ${job.date}`}</p>
                  </div>
                </div>
                <DownloadIcon
                  className="h-6 w-6 text-gray-800 cursor-pointer hover:text-blue-800"
                  onClick={() => handleDownload('Presupuesto')}
                />
              </Link>
              <Link to={`/clients/Materiales/${id}/${jobIndex}`} className="flex mb-2 items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-red-600 mr-4" />
                  <div>
                    <h3 className="text-md font-semibold text-gray-800">Listado de Materiales</h3>
                    <p className="text-sm text-gray-500">{`Modificado: ${job.date}`}</p>
                  </div>
                </div>
                <DownloadIcon
                  className="h-6 w-6 text-gray-800 cursor-pointer hover:text-blue-800"
                  onClick={() => handleDownload('Presupuesto')}
                />
              </Link>
            </li>
            {/* Repite la estructura para otros documentos */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Archives;
