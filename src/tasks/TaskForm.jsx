import React, { useState } from 'react';

const TaskForm = ({ clients, employees, addTask }) => {
  const [selectedClient, setSelectedClient] = useState('');
  const [taskName, setTaskName] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(''); // Para manejar el empleado responsable
  const [taskStatus, setTaskStatus] = useState('Iniciado');

  const handleAddTask = () => {
    if (selectedClient && taskName.trim() && selectedEmployee) {
      addTask(selectedClient, taskName, taskStatus, selectedEmployee);
      setTaskName('');
      setSelectedClient(''); // Limpiar la selección de cliente
      setSelectedEmployee(''); // Limpiar la selección de empleado
      setTaskStatus('Iniciado');
    }
  };

  return (
    <div className="p-4 rounded-md mb-4 sm:mb-4">
      <h2 className="text-lg font-semibold mb-2">Añadir Tarea</h2>
      <div className="grid grid-cols-4 gap-4">
        {/* Menú desplegable para seleccionar un cliente */}
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Seleccione Cliente</option>
          {clients.map((client) => (
            <option key={client.client_id} value={client.client_id}>
              {client.name}
            </option>
          ))}
        </select>

        {/* Campo para ingresar el nombre de la tarea */}
        <input
          type="text"
          placeholder="Nombre de la Tarea"
          className="w-full p-2 border border-gray-300 rounded"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        {/* Menú desplegable para seleccionar el empleado responsable */}
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Seleccione Responsable</option>
          {employees.map((employee) => (
            <option key={employee.employee_id} value={employee.employee_id}>
              {`${employee.first_name} ${employee.last_name}`}
            </option>
          ))}
        </select>

        {/* Botón para añadir la tarea */}
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
