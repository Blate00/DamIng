import React, { useState, useEffect } from 'react';
import TrabajadorForm from '../components/TrabajadorForm';
import TrabajadoresList from '../components/TrabajadorList';
import Breadcrumb from '../../general/Breadcrumb';
import { supabase } from '../../supabase/client';

const Trabajadores = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrabajadores = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          banco (banco_id, nombre_banco),
          tipocuenta (tipo_cuenta_id, nombre_tipo_cuenta)
        `);

      if (error) throw error;

      setTrabajadores(data);
    } catch (error) {
      console.error('Error al obtener los trabajadores:', error);
      setError('Error al cargar los trabajadores: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrabajadores();
  }, []);

  const handleDeleteTrabajador = async (id) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('employee_id', id);

      if (error) throw error;

      fetchTrabajadores(); // Refetch the list after deletion
    } catch (error) {
      console.error('Error al eliminar el trabajador:', error);
      setError('Error al eliminar el trabajador: ' + error.message);
    }
  };

  const handleTrabajadorAdded = () => {
    fetchTrabajadores(); // Refetch the list after adding a new employee
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg">
        <div className="p-5">
          <Breadcrumb />
          <h1 className="text-2xl font-bold mb-1 text-center md:text-left">Empresa</h1>

          <TrabajadorForm onTrabajadorAdded={handleTrabajadorAdded} />
          <h2 className="text-xl font-semibold mb-4">Lista de Trabajadores</h2>

          <TrabajadoresList trabajadores={trabajadores} onDeleteTrabajador={handleDeleteTrabajador} />
        </div>
      </div>
    </div>
  );
};

export default Trabajadores;