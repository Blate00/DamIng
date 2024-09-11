import React, { useState, useEffect, useRef } from 'react';
import TrabajadorForm from '../components/TrabajadorForm';
import TrabajadoresList from '../components/TrabajadorList';
import Breadcrumb from '../../general/Breadcrumb'; 
import { supabase } from '../../supabase/client'; // Asegúrate de importar tu cliente de Supabase

const Trabajadores = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [filteredTrabajadores, setFilteredTrabajadores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();

  // Función para obtener los trabajadores desde Supabase
  const fetchTrabajadores = async () => {
    try {
      const { data, error } = await supabase
        .from('employees') // Nombre de la tabla de trabajadores en Supabase
        .select('*'); // Seleccionamos todos los campos

      if (error) {
        throw error; // Si ocurre un error, lo lanzamos
      }

      setTrabajadores(data); // Guardamos los trabajadores en el estado
      setFilteredTrabajadores(data); // Actualizamos los trabajadores filtrados
    } catch (error) {
      console.error('Error al obtener los trabajadores:', error);
    }
  };

  useEffect(() => {
    fetchTrabajadores(); // Obtener trabajadores desde Supabase al montar el componente
  }, []);

  // Función para manejar la eliminación de un trabajador
  const handleDeleteTrabajador = async (id) => {
    try {
      const { error } = await supabase
        .from('employees') // Nombre de la tabla de trabajadores en Supabase
        .delete()
        .eq('employee_id', id);

      if (error) {
        throw error;
      }

      // Actualizamos la lista de trabajadores después de eliminar
      setTrabajadores(trabajadores.filter(trabajador => trabajador.employee_id !== id));
      setFilteredTrabajadores(filteredTrabajadores.filter(trabajador => trabajador.employee_id !== id));
    } catch (error) {
      console.error('Error al eliminar el trabajador:', error);
    }
  };

  // Función para manejar la adición de un trabajador
  const handleAddTrabajador = async (nombre, telefono, correo) => {
    try {
      const { data, error } = await supabase
        .from('employees') // Nombre de la tabla de trabajadores en Supabase
        .insert([{ first_name: nombre, phone_number: telefono, email: correo }]);

      if (error) {
        throw error;
      }

      // Actualizamos la lista de trabajadores con el nuevo trabajador añadido
      setTrabajadores([...trabajadores, data[0]]);
      setFilteredTrabajadores([...filteredTrabajadores, data[0]]);
    } catch (error) {
      console.error('Error al añadir el trabajador:', error);
    }
  };

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg">
        <div className="p-5">
          <Breadcrumb />
          <h1 className="text-2xl font-bold mb-1 text-center md:text-left">Empresa</h1>

          <TrabajadorForm addTrabajador={handleAddTrabajador} />
          <h2 className="text-xl font-semibold mb-4">Lista de Trabajadores</h2>

          <TrabajadoresList trabajadores={filteredTrabajadores} onDeleteTrabajador={handleDeleteTrabajador} />
        </div>
      </div>
    </div>
  );
};

export default Trabajadores;
