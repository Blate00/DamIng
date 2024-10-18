import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotsVerticalIcon, TrashIcon } from '@heroicons/react/outline';

const TrabajadoresList = ({ trabajadores, onDeleteTrabajador, loading }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleDotsClick = (index, event) => {
    event.stopPropagation();
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const handleDeleteTrabajador = (id, event) => {
    event.stopPropagation();
    onDeleteTrabajador(id);
    setOpenIndex(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTrabajadorClick = (trabajador) => {
    navigate('/empresa/liquidaciones', { state: { nombre: trabajador.name, correo: trabajador.email, telefono: trabajador.phone_number } });
  };

  const getInitial = (name) => {
    return name && typeof name === 'string' ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Trabajadores</h1>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#700F23]"></div>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {trabajadores.map((trabajador) => (
            <li key={trabajador.employee_id} 
                className="flex items-center justify-between py-4 hover:bg-gray-100 p-3 rounded-lg transition-colors duration-200 cursor-pointer"
                onClick={() => handleTrabajadorClick(trabajador)}>
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-[#700F23] text-white flex items-center justify-center text-lg font-medium">
                  {getInitial(trabajador.name)}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{trabajador.name || 'Sin nombre'}</h3>
                  <p className="text-sm text-gray-500">{trabajador.phone_number || 'Sin teléfono'}</p>
                </div>
              </div>
              <button
                onClick={(e) => handleDotsClick(trabajador.employee_id, e)}
                className="text-gray-500 hover:text-[#700F23] transition-colors duration-200"
              >
                <DotsVerticalIcon className="h-6 w-6" />
              </button>
              {openIndex === trabajador.employee_id && (
                <div ref={dropdownRef} className="absolute right-8 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-150 ease-in-out"
                    onClick={(e) => handleDeleteTrabajador(trabajador.employee_id, e)}
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Eliminar Trabajador
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrabajadoresList;