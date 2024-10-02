import React, { useState, useEffect } from 'react';
import TaskList from '../tasks/TaskList';
import Breadcrumb from '../general/Breadcrumb'; 
import { supabase } from '../supabase/client'
import ProyectosRecientes from './ProyectosRecientes'
import { AcademicCapIcon, BriefcaseIcon, ClipboardListIcon, UserGroupIcon } from '@heroicons/react/outline';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects:project_id (project_id, project_name)
        `);
  
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      throw error;
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const tasksData = await fetchTasks();
      setTasks(tasksData);
    } catch (error) {
      setError('Error al cargar los datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('task_id', taskId);

      if (error) throw error;
      loadData(); // Refetch tasks after updating
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      setError('Error al actualizar el estado de la tarea: ' + error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('task_id', taskId);

      if (error) throw error;
      loadData(); // Refetch tasks after deleting
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
    <div className="flex flex-col p-7 h-full">
      <Breadcrumb />
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Bienvenido David Millapan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-10">
      <div className="cuadro1 p-4 h-32 rounded-lg shadow-md flex items-center">
        <div className="bg-red-900 p-3 rounded-lg flex items-center justify-center">
          <AcademicCapIcon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4 text-left">
          <h2 className="text-white font-medium">Balance Total</h2>
          <p className="text-white text-2xl font-bold"> GG 0</p>
          <p className="text-white text-2xl font-bold"> Gestión 0</p>
        </div>
      </div>

      <div className="cuadro2 p-4 h-32 rounded-lg shadow-md flex items-center">
        <div className="bg-gray-900 p-3 rounded-lg flex items-center justify-center">
          <BriefcaseIcon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4 text-left">
          <h2 className="text-black font-medium">Resumen Mano Obra</h2>
          <p className="text-black text-2xl font-bold">0</p>
        </div>
      </div>

      <div className="cuadro2 p-4 h-32 rounded-lg shadow-md flex items-center">
        <div className="bg-gray-900 p-3 rounded-lg flex items-center justify-center">
          <ClipboardListIcon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4 text-left">
          <h2 className="text-black font-medium">Resumen Asignación</h2>
          <p className="text-black text-2xl font-bold">0</p>
        </div>
      </div>

      <div className="cuadro2 p-4 h-32 rounded-lg shadow-md flex items-center">
        <div className="bg-gray-900 p-3 rounded-lg flex items-center justify-center">
          <UserGroupIcon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4 text-left">
          <h2 className="text-black font-medium">Proyectos Activos</h2>
          <p className="text-black text-2xl font-bold">0</p>
        </div>
      </div>
    </div>

      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex-grow p-3 bg-white  rounded-lg">
          <h2 className="text-2xl font-bold mb-5">Tareas Pedientes</h2>
          <TaskList tasks={tasks} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} />        </div>

        <div className="w-full lg:w-1/4 bg-white p-3 rounded-lg">
        <h2 className="text-2xl font-bold mb-5">Proyectos Recientes</h2>
<ProyectosRecientes/>
        

        </div>
      </div>
    </div>
  );
};

export default Home;  