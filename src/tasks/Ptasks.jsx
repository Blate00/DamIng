import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Breadcrumb from '../general/Breadcrumb';
import { supabase } from '../supabase/client';

const Ptasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

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
      return [];
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
      return [];
    }
  };

  const loadData = async () => {
    const tasksData = await fetchTasks();
    const employeesData = await fetchEmployees();
    
    setEmployees(employeesData);

    const tasksWithEmployeeNames = tasksData.map(task => ({
      ...task,
      responsible_employee_name: employeesData.find(emp => emp.employee_id === task.responsible_employee_id)?.name || 'Desconocido'
    }));

    setTasks(tasksWithEmployeeNames);
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
    }
  };

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