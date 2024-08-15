import React, { useState, useRef, useEffect } from 'react';
import { DotsVerticalIcon } from '@heroicons/react/outline';

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

  return (
    <table className="w-full  border border-gray-200 rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-red-800 text-white">
          <th className="py-3 px-4 border-b text-left">Cliente</th>
          <th className="py-3 px-4 border-b text-left">Tarea</th>
          <th className="py-3 px-4 border-b text-left">Responsable</th>
          <th className="py-3 px-4 border-b text-left">Estado</th>
          <th className="py-3 px-4 border-b"></th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          <tr key={index} className="bg-gray-100  hover:bg-gray-50 relative">
            <td className="py-3 px-4 border-b text-gray-800">{task.clientName}</td>
            <td className="py-3 px-4 border-b text-gray-800">{task.taskName}</td>
            <td className="py-3 px-4 border-b text-gray-800">{task.responsible}</td>
            <td className="py-3 px-4 border-b">
              <select
                value={task.taskStatus}
                onChange={(e) => handleStatusChange(index, e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Iniciado">Iniciado</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </td>
            <td className="py-3 px-4 border-b text-center">
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
