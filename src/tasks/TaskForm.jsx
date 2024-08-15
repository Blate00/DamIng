import React, { useState } from 'react';

const TaskForm = ({ clients, addTask }) => {
  const [selectedClient, setSelectedClient] = useState('');
  const [taskName, setTaskName] = useState('');
  const [responsible, setResponsible] = useState('');
  const [taskStatus, setTaskStatus] = useState('Iniciado');

  const handleAddTask = () => {
    if (selectedClient && taskName.trim() && responsible.trim()) {
      addTask(selectedClient, taskName, taskStatus, responsible);
      setTaskName('');
      setResponsible('');
      setTaskStatus('Iniciado');
    }
  };

  return (
    <div className="p-4 rounded-md  mb-4 sm:mb-4">
      <h2 className="text-lg font-semibold mb-2">Añadir Tarea</h2>
      <div className="grid grid-cols-4 gap-4">
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Seleccione Cliente</option>
          {clients.map((client, index) => (
            <option key={index} value={client.name}>{client.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nombre de la Tarea"
          className="w-full p-2 border border-gray-300 rounded"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nombre Responsable"
          className="w-full p-2 border border-gray-300 rounded"
          value={responsible}
          onChange={(e) => setResponsible(e.target.value)}
        />
        <button
          className="w-full bg-red-800 text-white p-2 rounded hover:bg-red-900"
          onClick={handleAddTask}
        >
          Añadir Tarea
        </button>
      </div>
    </div>
  );
};

export default TaskForm;
