import React, { useState, useRef, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';

const TaskList = ({ tasks, updateTaskStatus, deleteTask }) => {
  const renderStatusIcon = (status) => {
    switch (status) {
      case 'Pendiente':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500 inline-block" />;
      case 'En Progreso':
        return <CheckCircleIcon className="h-5 w-5 text-green-500 inline-block" />;
      case 'Finalizado':
        return <XCircleIcon className="h-5 w-5 text-red-500 inline-block" />;
      default:
        return null;
    }
  };

  const handleDeleteClick = (taskId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      deleteTask(taskId);
    }
  };

  return (
    <table className="min-w-full border-r border-l border-gray-300 shadow-lg rounded-lg overflow-hidden">
      <thead>
        <tr className="text-center py-1 px-2 text-white border-r border-gray-700 font-bold bg-red-800 text-white uppercase text-sm leading-normal">
          <th className="py-3 px-6 text-center rounded-tl-lg">Nombre de la tarea</th>
          <th className="py-3 px-6 text-center">Responsable</th>
          <th className="py-3 px-6 text-center">Estado</th>
          <th className="py-3 px-6 text-center rounded-tr-lg">Acciones</th>
        </tr>
      </thead>
      <tbody className="text-gray-700 text-sm font-light">
        {tasks.map((task) => (
          <tr key={task.task_id} className="border-b border-gray-200 hover:bg-red-50 transition duration-150 ease-in-out">
            <td className="py-3 px-6 text-left whitespace-nowrap">
              <span className="font-medium text-black">{task.task_name}</span>
            </td>
            <td className="py-3 px-6 text-center">
              <span className="text-black">{task.responsible_employee_name}</span>
            </td>
            <td className="py-3 px-6 text-center">
              {renderStatusIcon(task.status)}
              <select
                value={task.status}
                onChange={(e) => updateTaskStatus(task.task_id, e.target.value)}
                className="ml-2 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-gray-200 focus:outline-none text-black cursor-pointer"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </td>
            <td className="py-3 px-6 text-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="size-6 cursor-pointer hover:text-red-600"
                onClick={() => handleDeleteClick(task.task_id)}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskList;