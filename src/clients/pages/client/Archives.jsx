import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/outline';
import Breadcrumb from '../../../general/Breadcrumb'; 

const Archives = () => {
  const { id } = useParams();
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients[id];

  if (!client) {
    return <div className="p-6 text-center text-gray-500">Cliente no encontrado</div>;
  }

  const handleDownload = (filename) => {
    alert(`Descargando archivo: ${filename}`);
  };

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg">
        <div className="p-5">
          <Breadcrumb/>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Documentos</h2>

        <ul className="space-y-2">
          <li>
            <Link to={`/clients/Presupuesto/${id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-red-600 mr-4" />
                <div>
                  <h3 className="text-md font-semibold text-gray-800">Presupuesto</h3>
                  <p className="text-sm text-gray-500">{`Modificado: ${client.jobDate}`}</p>
                </div>
              </div>
              <DownloadIcon 
                className="h-6 w-6 text-gray-800 cursor-pointer hover:text-blue-800"
                onClick={() => handleDownload('Planillas de dinero')} 
              />
            </Link>
          </li>

          <li>
            <Link to={`/clients/rendicion/${id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-red-600 mr-4" />
                <div>
                  <h3 className="text-md font-semibold text-gray-800">Rendición</h3>
                  <p className="text-sm text-gray-500">{`Modificado: ${client.jobDate}`}</p>
                </div>
              </div>
              <DownloadIcon 
                className="h-6 w-6 text-gray-800 cursor-pointer hover:text-green-800"
                onClick={() => handleDownload('Planilla de Materiales')} 
              />
            </Link>
          </li>  
          
          <li>
            <Link to={`/clients/flujo/${id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-red-600 mr-4" />
                <div>
                  <h3 className="text-md font-semibold text-gray-800">Flujo de Caja</h3>
                  <p className="text-sm text-gray-500">{`Modificado: ${client.jobDate}`}</p>
                </div>
              </div>
              <DownloadIcon 
                className="h-6 w-6 text-gray-800 cursor-pointer hover:text-green-800"
                onClick={() => handleDownload('Planilla de Materiales')} 
              />
            </Link>
          </li>  
          
          <li>
            <Link to={`/clients/Materiales/${id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-red-600 mr-4" />
                <div>
                  <h3 className="text-md font-semibold text-gray-800">Materiales</h3>
                  <p className="text-sm text-gray-500">{`Modificado: ${client.jobDate}`}</p>
                </div>
              </div>
              <DownloadIcon 
                className="h-6 w-6 text-gray-800 cursor-pointer hover:text-green-800"
                onClick={() => handleDownload('Planilla de Materiales')} 
              />
            </Link>
          </li>  
        </ul>
      </div>
    </div></div>
  );
};

export default Archives;
