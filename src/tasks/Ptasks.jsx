import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const Ptasks = () => {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem('tasks')) || []);
  const [clients] = useState(JSON.parse(localStorage.getItem('clients')) || []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (clientName, taskName, taskStatus, responsible) => {
    const newTask = { clientName, taskName, taskStatus, responsible };
    setTasks([...tasks, newTask]);
  };

  const updateTaskStatus = (index, newStatus) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, taskStatus: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="flex flex-col bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Gestión de Tareas</h1>
      <TaskForm clients={clients} addTask={addTask} />
      <TaskList tasks={tasks} updateTaskStatus={updateTaskStatus} />
    </div>
  );
};

export default Ptasks;
