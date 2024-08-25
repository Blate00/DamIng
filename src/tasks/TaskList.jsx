import React, { useState, useRef, useEffect } from 'react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';

const TaskList = ({ tasks, updateTaskStatus }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);

  const deleteTaskFromLocalStorage = (index) => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.splice(index, 1); 
    localStorage.setItem('tasks', JSON.stringify(storedTasks));
    window.location.reload();
  };

  const handleStatusChange = (index, newStatus) => {
    updateTaskStatus(index, newStatus);
  };

  const handleDotsClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleDeleteTask = (index) => {
    deleteTaskFromLocalStorage(index);
    setOpenIndex(null);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'Iniciado':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 inline-block" />;
      case 'En Progreso':
        return <CheckCircleIcon className="h-5 w-5 text-green-500 inline-block" />;
      case 'Finalizado':
        return <XCircleIcon className="h-5 w-5 text-red-500 inline-block" />;
      default:
        return null;
    }
  };

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="text-gray-500 text-sm leading-normal">
          <th className="py-3 px-6 text-left">Cliente</th>
          <th className="py-3 px-6 text-left">Tarea</th>
          <th className="py-3 px-6 text-left">Responsable</th>
          <th className="py-3 px-6 text-left">Estado</th>
          <th className="py-3 px-6 text-center"></th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {tasks.map((task, index) => (
          <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6 text-left whitespace-nowrap">
              <div className="flex items-center">
                <span className="font-medium">{task.clientName}</span>
              </div>
            </td>
            <td className="py-3 px-6 text-left">
              <div className="flex items-center">
                <span>{task.taskName}</span>
              </div>
            </td>
            <td className="py-3 px-6 text-left">
              <div className="flex items-center">
                <span>{task.responsible}</span>
              </div>
            </td>
            <td className="py-3 px-6 text-left">
              <div className="flex items-center">
                {renderStatusIcon(task.taskStatus)}
                <select
                  value={task.taskStatus}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                  className="ml-2 bg-transparent border-none focus:ring-0 focus:outline-none text-gray-600 cursor-pointer"
                >
                  <option value="Iniciado">Iniciado</option>
                  <option value="En Progreso">En Progreso</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
              </div>
            </td>
            <td className="py-3 px-6 text-center">
              <DotsVerticalIcon 
                className="h-6 w-6 text-gray-500 cursor-pointer" 
                onClick={() => handleDotsClick(index)} 
              />
              {openIndex === index && (
                <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100 focus:outline-none"
                    onClick={() => handleDeleteTask(index)}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskList;
