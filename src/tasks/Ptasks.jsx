import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Breadcrumb from '../general/Breadcrumb';
import { supabase } from '../supabase/client';

const Ptasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
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
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg">
        <div className="p-5">
          <Breadcrumb />
          <h1 className="text-2xl font-bold mb-1 text-center md:text-left">Tareas</h1>
          <TaskForm addTask={addTask} />
          <h2 className="text-xl font-semibold mb-4">Lista de Tareas</h2>
          <TaskList tasks={tasks} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} />
        </div>
      </div>
    </div>
  );
};

export default Ptasks;