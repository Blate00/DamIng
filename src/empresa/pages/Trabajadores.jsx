import React, { useState, useEffect } from 'react';
import TrabajadorForm from '../components/TrabajadorForm';
import TrabajadoresList from '../components/TrabajadorList';
import Breadcrumb from '../../general/Breadcrumb';
import axios from 'axios';

const Trabajadores = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTrabajadores = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/empleados');
      setTrabajadores(response.data);
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
      await axios.delete(`http://localhost:5000/api/empleados/${id}`);
      fetchTrabajadores();
    } catch (error) {
      console.error('Error al eliminar el trabajador:', error);
      setError('Error al eliminar el trabajador: ' + error.message);
    }
  };

  const handleTrabajadorAdded = () => {
    fetchTrabajadores();
    setIsModalOpen(false);
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
    <div className="flex flex-col h-full">
      <div className="h-full rounded-lg">
        <div className="p-5">
          <Breadcrumb />
          <TrabajadorForm 
            onTrabajadorAdded={handleTrabajadorAdded} 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
          <TrabajadoresList 
            trabajadores={trabajadores} 
            onDeleteTrabajador={handleDeleteTrabajador}
            loading={loading}
            onOpenModal={() => setIsModalOpen(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default Trabajadores;