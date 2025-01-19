import React, { useState, useEffect } from 'react';
import TaskList from '../tasks/TaskList';
import Breadcrumb from '../general/Breadcrumb'; 
import ProyectosRecientes from './ProyectosRecientes'
import DashboardSummary from './DashboardSummary';

import { AcademicCapIcon, BriefcaseIcon, ClipboardListIcon, UserGroupIcon } from '@heroicons/react/outline';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [employees, setEmployees] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Aquí deberías implementar tu nueva lógica para cargar los datos
      // Por ejemplo, usando una API REST u otro servicio
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addTask = async (taskData) => {
    try {
      // Implementar nueva lógica para agregar tareas
      loadData(); 
    } catch (error) {
      console.error('Error al agregar la tarea:', error);
      setError('Error al agregar la tarea: ' + error.message);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      // Implementar nueva lógica para actualizar el estado de las tareas
      loadData(); 
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      setError('Error al actualizar el estado de la tarea: ' + error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      // Implementar nueva lógica para eliminar tareas
      loadData(); 
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      setError('Error al eliminar la tarea: ' + error.message);
    }
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
    <div className="flex flex-col p-3 h-full">
      <Breadcrumb />
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Bienvenido David Millapan</h2>
      <DashboardSummary activeProjectsCount={activeProjectsCount} />

      <div className="flex flex-col lg:flex-row bg-white rounded-lg p-4">
        <div className="flex-grow p- rounded-lg">    
          <h2 className="text-2xl font-bold mb-5 ">Pedientes</h2>
          <TaskList tasks={tasks} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} />
          <h2 className="text-2xl font-bold mb-5 mt-5 ">Recientes</h2>
          <ProyectosRecientes/>
        </div>
      </div>
    </div>
  );
};

export default Home;