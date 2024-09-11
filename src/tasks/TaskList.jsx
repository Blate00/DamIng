import React, { useState, useRef, useEffect } from 'react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';

const TaskList = ({ tasks, updateTaskStatus }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);

  const handleStatusChange = (index, newStatus) => {
    updateTaskStatus(index, newStatus);
  };

  const handleDotsClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
          <th className="py-3 px-6 text-left">Nombre de la tarea</th>
          <th className="py-3 px-6 text-left">Responsable</th>
          <th className="py-3 px-6 text-left">Estado</th>
          <th className="py-3 px-6 text-center"></th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {tasks.map((task, index) => (
          <tr key={task.task_id} className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-3 px-6 text-left whitespace-nowrap">
              <div className="flex items-center">
                <span className="font-medium">{task.task_name}</span>
              </div>
            </td>
            <td className="py-3 px-6 text-left">
              <div className="flex items-center">
                <span>{task.responsible_employee_id}</span>
              </div>
            </td>
            <td className="py-3 px-6 text-left">
              <div className="flex items-center">
                {renderStatusIcon(task.status)}
                <select
                  value={task.status}
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
                    // Agrega la lógica de eliminación basada en la API si es necesario
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
