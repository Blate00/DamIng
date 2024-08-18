import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

const TrabajadorForm = ({ addTrabajador }) => {
  const [desplegado, setDesplegado] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleAddTrabajador = () => {
    const { nombre, telefono, correo } = formData;
    if (nombre.trim()) {
      addTrabajador(nombre, telefono, correo);
      setFormData({ nombre: '', telefono: '', correo: '' });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setDesplegado(!desplegado)}>
        <h2 className="text-xl font-semibold">Agregar Trabajador</h2>
        {desplegado ? (
          <ChevronUpIcon className="w-6 h-6 text-gray-700" />
        ) : (
          <ChevronDownIcon className="w-6 h-6 text-gray-700" />
        )}
      </div>

      {desplegado && (
        <div className="mt-4">
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre del Trabajador
            </label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              id="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              value={formData.correo}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAddTrabajador}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
            >
              Agregar Trabajador
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrabajadorForm;
