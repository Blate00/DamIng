import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotsVerticalIcon } from '@heroicons/react/outline';

const TrabajadoresList = ({ trabajadores, onDeleteTrabajador }) => {
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
    navigate('/liquidaciones', { state: { nombre: trabajador.name, correo: trabajador.email, telefono: trabajador.phone_number } });
  };

  const getInitial = (lastName) => {
    return lastName && typeof lastName === 'string' ? lastName.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="relative rounded-lg">
      <ul className="space-y-2">
        {trabajadores.map((trabajador) => (
          <li key={trabajador.employee_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleTrabajadorClick(trabajador)}>
            <div className="flex items-center w-full">
              <div className="h-8 w-8 rounded-full bg-gray-500 text-white flex items-center justify-center mr-2">
                {getInitial(trabajador._name)}
              </div>
              <div>
                <h3 className="font-semibold">{trabajador.name || 'Sin apellido'}</h3>
                <p className="text-sm text-gray-500">{trabajador.phone_number || 'Sin teléfono'}</p>
                <p className="text-sm text-gray-500">{trabajador.email || 'Sin correo'}</p>
                <p className="text-sm text-gray-500">Banco: {trabajador.banco?.nombre_banco || 'No especificado'}</p>
                <p className="text-sm text-gray-500">Tipo de cuenta: {trabajador.tipocuenta?.nombre_tipo_cuenta || 'No especificado'}</p>
                <p className="text-sm text-gray-500">Número de cuenta: {trabajador.account_number || 'No especificado'}</p>
              </div>
            </div>
            <DotsVerticalIcon
              className="h-6 w-6 text-gray-500 cursor-pointer"
              onClick={(e) => handleDotsClick(trabajador.employee_id, e)}
            />
            {openIndex === trabajador.employee_id && (
              <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                  onClick={(e) => handleDeleteTrabajador(trabajador.employee_id, e)}
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