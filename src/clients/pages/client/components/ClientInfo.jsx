import React from 'react';

const ClientInfo = ({ client, job }) => {
  const currentDate = new Date().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="flex items-start">
      <table className="min-w-full rounded-lg shadow-lg">
        <thead className="bg-red-800 rounded-lg">
          <tr className="border-white">
            <th className="text-center py-1 px-1 text-white border-r border-white font-bold">
              {job?.project_name || 'Nombre del Trabajo'}
            </th>
            <th className="text-center py-2 px-4 text-white border-r border-white font-bold">
              Nº CTZ: <span className="text-gray-800 font-semibold">{job?.quote_number || 'N/A'}</span>
            </th>
            <th className="text-center py-2 px-4 border-r text-white border-white font-bold">
              {client?.name ? client.name.toLowerCase() : 'Nombre del Cliente'}
            </th>
            <th className="text-center py-2 px-4 text-white border-white">
              {currentDate}
            </th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default ClientInfo;
