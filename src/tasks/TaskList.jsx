import React from 'react';
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
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-300">  
      <table className="min-w-full divide-y divide-gray-200">  
        <thead className="bg-gradient-to-r from-red-800 to-red-900">  
          <tr>  
            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">  
               Proyecto   
            </th>  
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">  
            Nombre de la tarea  
            </th>  
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">  
              Responsable  
            </th>  
            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">  
              Estado  
            </th>  
            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">  
              Acciones  
            </th>  
          </tr>  
        </thead>  
        <tbody className="bg-white divide-y divide-gray-200">  
          {tasks.map((task, index) => (  
            <tr key={task.task_id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-red-50 transition-colors duration-150`}>  
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">  
                 {task.project_name}   
              </td>  
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">  
               {task.task_name} 
              </td>  
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">  
                {task.responsible_employee_name}  
              </td>  
              <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">  
                {renderStatusIcon(task.status)}  
                <select  
                  value={task.status}  
                  onChange={(e) => updateTaskStatus(task.task_id, e.target.value)}  
                  className="ml-2 text-center bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-red-200 focus:border-red-500 text-gray-900 text-sm cursor-pointer"  
                >  
                  <option value="Pendiente">Pendiente</option>  
                  <option value="En Progreso">En Progreso</option>  
                  <option value="Finalizado">Finalizado</option>  
                </select>  
              </td>  
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center">  
                <button   
                  onClick={() => handleDeleteClick(task.task_id)}  
                  className="text-red-600 hover:text-red-900 transition-colors duration-200"  
                >  
                  <svg   
                    xmlns="http://www.w3.org/2000/svg"   
                    className="h-5 w-5"  
                    viewBox="0 0 20 20"   
                    fill="currentColor"  
                  >  
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />  
                  </svg>  
                </button>  
              </td>  
            </tr>  
          ))}  
        </tbody>  
      </table>  
    </div>  
  );  
};  

export default TaskList;  