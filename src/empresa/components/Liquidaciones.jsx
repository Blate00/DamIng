import React from 'react';
import { useLocation,Link } from 'react-router-dom';
import Breadcrumb from '../../general/Breadcrumb';
import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/outline';

const Liquidaciones = () => {
  const location = useLocation();
  const { nombre, correo, telefono } = location.state || {};

  return (
   
      <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg">
        <div className="p-5">
          <Breadcrumb />
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Pagos Registrados Al Trabajador {nombre}</h2>
 
         
          
            <div className="m-5">
            <h3 className="text-lg font-semibold">Datos del Trabajador:</h3>
            <p><strong>Correo:</strong> {correo}</p>
            <p><strong>Telefono:</strong> {telefono}</p>

          </div>
              <Link
                to={`/pagos`}
                className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <DocumentTextIcon className="h-8 w-8 text-red-600 mr-4" />
                <div>
                  <h3 className="text-md font-semibold text-gray-800">Liquidación Semanal</h3>
                  <h3 className="text-md  text-gray-800">Fecha de pago: 31-08-2024</h3>
                </div>
                <DownloadIcon 
                  className="h-6 w-6 text-gray-800 cursor-pointer hover:text-blue-800 ml-auto"
                  onClick={() => alert('Descargando información del pago')} 
                />
              </Link>
            </div>
          </div>
        </div>

  );
};

export default Liquidaciones;