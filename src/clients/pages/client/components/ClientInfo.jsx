import React from 'react';

const ClientInfo = ({ client, job }) => (
    <div className="flex items-start mt-10">
    {/* Contenedor para la imagen del logo */}
    

    {/* Tabla de información del cliente y trabajo */}
    <table className="min-w-full  rounded-lg shadow-lg">
      <thead className=' bg-red-800  rounded-lg '>
        <tr className=" border- border-white">
          <th className="text-center py-1 px-1 text-white  border-r border-white font-bold">
            Montaje Luminarias
          </th>
          <th className="text-center py-2 px-4 text-white border-r border-white font-bold">
            Nº CTZ: <span className="text-gray-800 font-semibold">{job.quotationNumber || 'N/A'}</span>
          </th>
  
          <th className="text-center py-2 px-4 border-r text-white border-white font-bold">
            {client.name ? client.name.toUpperCase() : 'Nombre del cliente'}
          </th>
          <th className="text-center py-2 px-4 text-white border-white">
            {job.date}
          </th>
        </tr>
      </thead>
    </table>
  </div>
);

export default ClientInfo;
