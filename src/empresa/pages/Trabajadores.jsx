import React, { useState, useEffect, useRef } from 'react';
import TrabajadorForm from '../components/TrabajadorForm';
import TrabajadoresList from '../components/TrabajadorList';
import Breadcrumb from '../../general/Breadcrumb'; 

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
    <div className="flex flex-col p-3 bg-white h-full">
    <div className="bg-white h-full rounded-lg ">
      <div className=" p-5">
        <Breadcrumb/>
      <h1 className="text-2xl font-bold mb-1 text-center md:text-left">Empresa</h1>

        <TrabajadorForm trabajadores={filteredTrabajadores} addTrabajador={handleAddTrabajador} />
        <h2 className="text-xl font-semibold mb-">Lista de Trabajadores</h2>

        <TrabajadoresList trabajadores={filteredTrabajadores} onDeleteTrabajador={handleDeleteTrabajador} />
      </div>
    </div>  </div>
  );
};

export default Trabajadores;
