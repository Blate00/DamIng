import React from 'react';
import damLogo from '../../../../assets/damLogo.png'; // Asegúrate de que esta ruta sea correcta

const ClientInfo = ({ client = {}, job = {} }) => {
  const formattedDate = job.date
    ? new Date(job.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Fecha no disponible';

  return (
    <div className="flex items-start">
      {/* Contenedor para la imagen del logo */}
      

      {/* Tabla de información del cliente y trabajo */}
      <table className="min-w-full table-auto border border-black">
        <thead>
          <tr className="bg-white border- border-black">
            <th className="text-center py-2 px-4 border border-black font-bold">
              Montaje Luminarias
            </th>
            <th className="text-center py-2 px-4 border border-black">
              Nº CTZ: <span className="text-gray-800 font-semibold">{job.quotationNumber || 'N/A'}</span>
            </th>
          </tr>
          <tr className="bg-white border-b border-black">
            <th className="text-center py-2 px-4 border-r border-black font-bold">
              {client.name ? client.name.toUpperCase() : 'Nombre del cliente'}
            </th>
            <th className="text-center py-2 px-4 border-r border-black">
              {job.date}
            </th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

const ItemsTable = ({ items, handleChange, formatCLP, client, job }) => (
  <div className="overflow-x-auto">
    {/* Componente ClientInfo */}

    <table className="min-w-full table-auto border border-black">
      <thead className="bg-red-800 text-white">
        <tr>
          <th className="py-2 px-4 border text-xs md:text-base">Item</th>
          <th className="py-2 px-4 border text-xs md:text-base">Descripción</th>
          <th className="py-2 px-4 border text-xs md:text-base">Cantidad</th>
          <th className="py-2 px-4 border text-xs md:text-base">Valor Unit</th>
          <th className="py-2 px-4 border text-xs md:text-base">Total</th>
        </tr>
      </thead>
      <tbody className="text-center bg-white">
        {items.map((item, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="py-2 px-4 border text-xs md:text-base">{index + 1}</td>
            <td className="py-2 px-4 border">
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                className="p-1 w-full text-left text-xs md:text-base border-none"
              />
            </td>
            <td className="py-2 px-4 border">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                className="p-1 w-full text-left text-xs md:text-base border-none"
              />
            </td>
            <td className="py-2 px-4 border">
              <input
                type="number"
                value={item.unitValue}
                onChange={(e) => handleChange(index, 'unitValue', e.target.value)}
                className="p-1 w-full text-left text-xs md:text-base border-none"
              />
            </td>
            <td className="py-2 px-4 border text-xs md:text-base">{formatCLP(item.total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ItemsTable;
