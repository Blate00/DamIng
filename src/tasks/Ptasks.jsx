import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Breadcrumb from '../general/Breadcrumb';
import { supabase } from '../supabase/client'; // Asegúrate de importar tu cliente de Supabase

const Ptasks = () => {
  const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas desde Supabase
  const [clients, setClients] = useState([]); // Estado para los clientes
  const [employees, setEmployees] = useState([]); // Estado para los empleados

  // Función para obtener las tareas desde Supabase
  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks') // Nombre de la tabla de tareas en Supabase
        .select('task_id, task_name, status, responsible_employee_id');

      if (error) {
        throw error; // Si ocurre un error, lo lanzamos
      }

      setTasks(data); // Guardamos las tareas en el estado
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    }
  };

  // Obtener los clientes desde Supabase
  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients') // Nombre de la tabla de clientes en Supabase
        .select('client_id, name'); // Seleccionamos los campos necesarios

      if (error) {
        throw error; // Si ocurre un error, lo lanzamos
      }

      setClients(data); // Guardamos los clientes en el estado
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  };

  // Obtener los empleados desde Supabase
  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees') // Nombre de la tabla de empleados en Supabase
        .select('employee_id, first_name, last_name'); // Seleccionamos los campos necesarios

      if (error) {
        throw error; // Si ocurre un error, lo lanzamos
      }

      setEmployees(data); // Guardamos los empleados en el estado
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }
  };

  // useEffect para cargar las tareas, los clientes y los empleados al montar el componente
  useEffect(() => {
    fetchTasks(); // Obtener tareas desde Supabase
    fetchClients(); // Obtener clientes
    fetchEmployees(); // Obtener empleados
  }, []);

  // Función para agregar una nueva tarea
  const addTask = async (clientName, taskName, taskStatus, responsible) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ task_name: taskName, status: taskStatus, responsible_employee_id: responsible }]);

      if (error) {
        throw error;
      }

      // Actualizamos las tareas con la nueva tarea añadida
      setTasks([...tasks, data[0]]);
    } catch (error) {
      console.error('Error al agregar la tarea:', error);
    }
  };

  // Función para actualizar el estado de una tarea
  const updateTaskStatus = async (index, newStatus) => {
    const taskToUpdate = tasks[index];

    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('task_id', taskToUpdate.task_id);

      if (error) {
        throw error;
      }

      // Actualizamos el estado localmente después de que la base de datos sea actualizada
      const updatedTasks = tasks.map((task, i) =>
        i === index ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
    }
  };

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg">
        <div className="p-5">
          <Breadcrumb />
          <h1 className="text-2xl font-bold mb-1 text-center md:text-left">Gestión de Tareas</h1>
          <TaskForm clients={clients} employees={employees} addTask={addTask} />
          <h2 className="text-xl font-semibold mb-4">Lista de Tareas</h2>
          <TaskList tasks={tasks} updateTaskStatus={updateTaskStatus} />
        </div>
      </div>
    </div>
  );
};

export default Ptasks;
