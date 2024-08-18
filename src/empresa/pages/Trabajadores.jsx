import React, { useState, useEffect, useRef } from 'react';
import TrabajadorForm from '../components/TrabajadorForm';
import TrabajadoresList from '../components/TrabajadorList';

const Trabajadores = () => {
  const [trabajadores, setTrabajadores] = useState(JSON.parse(localStorage.getItem('trabajadores')) || []);
  const [filteredTrabajadores, setFilteredTrabajadores] = useState(trabajadores);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    localStorage.setItem('trabajadores', JSON.stringify(trabajadores));
    setFilteredTrabajadores(trabajadores);
  }, [trabajadores]);

  const handleDeleteTrabajador = (index) => {
    const updatedTrabajadores = trabajadores.filter((_, i) => i !== index);
    setTrabajadores(updatedTrabajadores);
  };

  const handleAddTrabajador = (nombre, telefono, correo) => {
    const nuevoTrabajador = { nombre, telefono, correo };
    setTrabajadores(prevTrabajadores => [...prevTrabajadores, nuevoTrabajador]);
  };

  return (
    <div className="flex flex-col p-3">
      <div className="w-full rounded-lg p-5">
        <TrabajadorForm trabajadores={filteredTrabajadores} addTrabajador={handleAddTrabajador} />
        <TrabajadoresList trabajadores={filteredTrabajadores} onDeleteTrabajador={handleDeleteTrabajador} />
      </div>
    </div>
  );
};

export default Trabajadores;
