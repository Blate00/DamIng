import React from 'react';

const ClientInfo = ({ client, job }) => {
  const currentDate = new Date().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="flex items-start">
      <table className="min-w-full shadow-lg overflow-hidden">
        <thead className="bg-red-800 rounded-t-lg">
          <tr className="border-white">{/* Eliminamos los espacios en blanco aquí */}
            <th className="text-center py-1 px-2 text-white border-r border-gray-700 font-bold rounded-tl-lg">
              Nº CTZ: <span className="text-gray-900 font-semibold">{job?.quote_number || 'N/A'}</span>
            </th>
            <th className="text-center py-2 px-2 text-white border-r border-gray-700 font-bold">
              {job?.project_name || 'Nombre del Trabajo'}
            </th>
            <th className="text-center py-2 px-2 border-r text-white border-gray-700 font-bold">
              {client?.name ? client.name.toLowerCase() : 'Nombre del Cliente'}
            </th>
            <th className="text-center py-2 px-2 text-white border-gray-700 rounded-tr-lg">
              {currentDate}
            </th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default ClientInfo;