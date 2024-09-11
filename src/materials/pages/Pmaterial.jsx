import React, { useState } from 'react';
import { useMaterials } from '../../general/MaterialsContext'; // Ajusta la ruta según la ubicación del contexto
import Breadcrumb from '../../general/Breadcrumb';

const Pmaterial = () => {
  const [materials] = useMaterials(); // Solo obtenemos los materiales, sin necesidad de setMaterials
  const [filterGroup, setFilterGroup] = useState('');

  const groups = [...new Set(materials.map(material => material.category))];

  const filteredMaterials = filterGroup ? 
    materials.filter(material => material.category === filterGroup) :
    materials;

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white rounded-lg p-6">
        <div className="p-5">
          <Breadcrumb />
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Gestión de Materiales</h1>

          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Filtrar por Grupo</h2>
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Mostrar Todos</option>
              {groups.map((group, index) => (
                <option key={index} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <h2 className="text-xl font-semibold mb-4">Lista de Materiales</h2>
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-gray-500 text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Item</th>
                  <th className="py-3 px-6 text-left">Grupo</th>
                  <th className="py-3 px-6 text-left">Descripción</th>
                  <th className="py-3 px-6 text-left">Valor</th>
                  <th className="py-3 px-6 text-left">Fecha</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {filteredMaterials.map((material, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 px-6 text-left">{index + 1}</td>
                    <td className="py-3 px-6 text-left">{material.category}</td>
                    <td className="py-3 px-6 text-left">{material.description}</td>
                    <td className="py-3 px-6 text-left">${material.value}</td>
                    <td className="py-3 px-6 text-left">{new Date(material.entry_date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pmaterial;
