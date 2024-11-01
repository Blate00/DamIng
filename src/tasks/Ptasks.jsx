import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importa Axios
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Breadcrumb from '../general/Breadcrumb';

const Ptasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks'); // Usa Axios para obtener tareas
      setTasks(response.data);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      setError('Error al obtener las tareas: ' + error.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/empleados'); // Usa Axios para obtener empleados
      setEmployees(response.data);
    } catch (error) {
      console.error('Error al obtener los empleados:', error);
      setError('Error al obtener los empleados: ' + error.message);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchTasks(), fetchEmployees()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addTask = async (taskData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', taskData); // Usa Axios para agregar tarea
      setTasks((prevTasks) => [...prevTasks, response.data]); // Agrega la nueva tarea a la lista
      setIsModalOpen(false); // Cierra el modal después de agregar la tarea
    } catch (error) {
      console.error('Error al agregar la tarea:', error);
      setError('Error al agregar la tarea: ' + error.message);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}/status`, { status: newStatus }); // Usa Axios para actualizar el estado
      await fetchTasks(); // Refetch tasks after updating
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      setError('Error al actualizar el estado de la tarea: ' + error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`); // Usa Axios para eliminar la tarea
      await fetchTasks(); // Refetch tasks after deleting
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
    <div className="flex flex-col h-full">
      <div className="h-full rounded-lg">
        <div className="p-5">
          <Breadcrumb />
          <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Lista de Tareas</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <TaskForm 
              addTask={addTask} 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)}
            />
            <TaskList tasks={tasks} updateTaskStatus={updateTaskStatus} deleteTask={deleteTask} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ptasks;