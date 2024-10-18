import React, { useState, useEffect } from 'react';
import TaskList from '../tasks/TaskList';
import Breadcrumb from '../general/Breadcrumb'; 
import { supabase } from '../supabase/client'
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


  const fetchActiveProjectsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Iniciado');

      if (error) throw error;
      return count;
    } catch (error) {
      console.error('Error al obtener el conteo de proyectos activos:', error);
      throw error;
    }
  };
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

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('employee_id, name');
  
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
      throw error;
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, employeesData] = await Promise.all([fetchTasks(), fetchEmployees()]);
      
      setEmployees(employeesData);

      const tasksWithEmployeeNames = tasksData.map(task => ({
        ...task,
        responsible_employee_name: employeesData.find(emp => emp.employee_id === task.responsible_employee_id)?.name || 'Desconocido'
      }));

      setTasks(tasksWithEmployeeNames);
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
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select();

      if (error) throw error;
      loadData(); // Refetch tasks after adding
    } catch (error) {
      console.error('Error al agregar la tarea:', error);
      setError('Error al agregar la tarea: ' + error.message);
    }
  };

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
    <div className="flex flex-col p-5 h-full">
      <Breadcrumb />
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Bienvenido David Millapan</h2>
      <DashboardSummary activeProjectsCount={activeProjectsCount} />

      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex-grow p-5 bg-white  rounded-lg">
          <h2 className="text-2xl font-bold mb-5 ">Tareas Pedientes</h2>
          <TaskList tasks={tasks} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} />
             </div>

        <div className="w-full lg:w-1/4 ">
<ProyectosRecientes/>
        

        </div>
      </div>
    </div>
  );
};

export default Home;  