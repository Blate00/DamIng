import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotsVerticalIcon } from '@heroicons/react/outline';

const TrabajadoresList = ({ trabajadores, onDeleteTrabajador }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleDotsClick = (index) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const handleDeleteTrabajador = (index) => {
    onDeleteTrabajador(index);
    setOpenIndex(null);
  };

  const handleViewPayments = (trabajador) => {
    navigate('/pagos', { state: { trabajadorId: trabajador.id } });
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

  return (
    <div className="rounded-lg p-4">
      <ul className="space-y-2">
        {trabajadores.map((trabajador, index) => (
          <li key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-500 text-white flex items-center justify-center mr-2">
                {trabajador.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold">{trabajador.nombre}</h3>
                <p className="text-sm text-gray-500">{trabajador.telefono}</p>
              </div>
            </div>

            <DotsVerticalIcon
              className="h-6 w-6 text-gray-500 cursor-pointer"
              onClick={() => handleDotsClick(index)}
            />
            {openIndex === index && (
              <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-100"
                  onClick={() => handleViewPayments(trabajador)}
                >
                  Ver Pagos
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                  onClick={() => handleDeleteTrabajador(index)}
                >
                  Eliminar Trabajador
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrabajadoresList;
