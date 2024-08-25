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
<div className="flex flex-col p-3">
      <div className="uwu2 bg-white rounded-lg p-4 ">
        <h2 className="text-xl font-semibold mb-4">Documentos</h2>

        <ul className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <li>
            <Link to={`/Presupuesto/${id}`} className="flex items-center justify-between w-full bg-gray-50 p-2 rounded-lg hover:bg-red-200 transition-colors cursor-pointer">
              <div className="flex items-center">
                <DocumentTextIcon className="h-6 w-6 text-gray-500 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-800">Planillas de dinero</h3>
                  <p className="text-sm text-gray-500">{`Modificado: ${client.jobDate}`}</p>
                </div>
              </div>
             
              
            
            </Link>
          </li>

         

          <li>
            <Link to={`/Materiales/${id}`} className="flex items-center justify-between w-full bg-gray-50 p-2 rounded-lg hover:bg-red-200 transition-colors cursor-pointer">
              <div className="flex items-center">
                <DocumentTextIcon className="h-6 w-6 text-gray-500 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-800">Planilla de Materiales</h3>
                  <p className="text-sm text-gray-500">{`Modificado: ${client.jobDate}`}</p>
                </div>
              </div>
           
            </Link>
          </li>  
        </ul>
      </div></div>

  );
};

export default Archives;
