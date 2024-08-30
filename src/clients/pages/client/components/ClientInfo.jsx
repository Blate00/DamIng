import React from 'react';
import damLogo from '../../../../assets/damLogo.png';

const ClientInfo = ({ client = {}, job = {} }) => {
  const formattedDate = job.date
    ? new Date(job.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Fecha no disponible';

  return (
    <div className="flex justify-between items-center  border-black">
      {/* Imagen */}
      <img src={damLogo} alt="Logo" className="w-31 " />

      {/* Información del trabajo */}
      <div className="w-full">
        <table className="min-w-full bg-white border-collapse">
          <thead className="bg-white border-b border-black">
            
            <tr>
          
              <th className="text-center py- px-4 border border-black font-bold" colSpan="2">
                Montaje Luminarias
              </th>
              <th className="text-center py- px-4 border border-black" colSpan="2">
                Nº CTZ: <span className="text-gray-800 font-semibold">{job.quotationNumber || 'N/A'}</span>
              </th>
              
            </tr>
            <tr>
              <th className="text-center py-2 px-4 border-r border-black font-bold">
                {client.name ? client.name.toUpperCase() : 'Nombre del cliente'}
              </th>
             
              <th className="text-center py-2 px-4 border  border-black" colSpan="2">
              {job.date}
              </th>

            </tr>
           
          </thead>
        </table>
      </div>
    </div>
  );
};

export default ClientInfo;
