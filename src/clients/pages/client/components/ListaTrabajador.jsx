// AccesoPago.jsx
import React, { useState, useRef, useEffect } from 'react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';

const AccesoPago = ({ trabajadores, onDeleteTrabajador }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleDotsClick = (index) => {
    setOpenIndex(prevIndex => prevIndex === index ? null : index);
  };

  const handleDeleteTrabajador = (index) => {
    onDeleteTrabajador(index);
    setOpenIndex(null);
  };

  const handlePagoClick = (trabajador) => {
    navigate('/pago', { state: { trabajador } });
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
    <div className="rounded-lg p-3">
      <ul className="grid grid-cols-1 space-y-2">
        {trabajadores.map((trabajador, index) => (
          <li key={index}   onClick={() => handlePagoClick(trabajador)} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-500 text-white flex items-center justify-center mr-2">
                {trabajador.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold">{trabajador.nombre}</h3>
              </div>
            </div>
         
           
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccesoPago;
