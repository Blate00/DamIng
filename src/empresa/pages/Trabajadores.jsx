import React, { useState, useEffect } from 'react';
import TrabajadorForm from '../components/TrabajadorForm';
import TrabajadoresList from '../components/TrabajadorList';

const Trabajadores = () => {
  const [trabajadores, setTrabajadores] = useState([]);

  // Cargar los trabajadores del local storage al montar el componente
  useEffect(() => {
    const storedTrabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];
    setTrabajadores(storedTrabajadores);
  }, []);

  // Actualizar el local storage cada vez que cambia el estado de trabajadores
  useEffect(() => {
    localStorage.setItem('trabajadores', JSON.stringify(trabajadores));
  }, [trabajadores]);

  const handleAddTrabajador = (nombre, telefono, correo) => {
    const nuevoTrabajador = { nombre, telefono, correo, image: nombre.charAt(0).toUpperCase() };
    setTrabajadores(prevTrabajadores => [...prevTrabajadores, nuevoTrabajador]);
  };

  const handleDeleteTrabajador = (index) => {
    const updatedTrabajadores = trabajadores.filter((_, i) => i !== index);
    setTrabajadores(updatedTrabajadores);
  };

  return (
    <div>
      <TrabajadorForm addTrabajador={handleAddTrabajador} />
      <TrabajadoresList trabajadores={trabajadores} onDeleteTrabajador={handleDeleteTrabajador} />
    </div>
  );
};

export default Trabajadores;
