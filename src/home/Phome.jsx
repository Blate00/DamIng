import React, { useState, useEffect } from 'react';
import TaskList from '../tasks/TaskList';
import RecientClient from './RecientClient'; // Asegúrate de ajustar la ruta según tu estructura de archivos
import { HomeIcon } from '@heroicons/react/outline';

const Home = () => {
  const [clientCount, setClientCount] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Obtener el número de clientes desde localStorage
    const savedClients = JSON.parse(localStorage.getItem('clients')) || [];
    setClientCount(savedClients.length);
    setClients(savedClients);

    // Obtener las tareas desde localStorage
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  const handleDeleteClient = (index) => {
    const updatedClients = clients.filter((_, i) => i !== index);
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  return (
    <div className="uwu3 flex flex-col p-7  h-full">
      <div className="grid grid-cols-4 gap-2 mb-10">
        
        <div className="cuadro1  p-4 h-32 rounded-lg shadow-md flex items-center">
    <div className="bg-red-900 p-3 rounded-lg flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
      </svg>
    </div>
    <div className="ml-4 text-left">
      <h2 className="text-white font-medium">Balance Total</h2>
      <p className="text-white text-2xl font-bold">0</p>
    </div>
  </div>
  
  
          <div className="cuadro2  p-4 h-32 rounded-lg shadow-md flex items-center">
            <div className="bg-gray-900 p-3 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <div className="ml-4 text-left">
              <h2 className="text-black font-medium">Total Materiales</h2>
              <p className="text-black text-2xl font-bold">0</p>
            </div>
          </div>
  
          <div className="cuadro2 p-4 h-32 rounded-lg shadow-md flex items-center">
            <div className="bg-gray-900 p-3 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
              </svg>
            </div>
            <div className="ml-4 text-left">
              <h2 className="text-black font-medium">Facturas Totales</h2>
              <p className="text-black text-2xl font-bold">0</p>
            </div>
          </div>
  
          <div className="cuadro2 p-4 h-32 rounded-lg shadow-md flex items-center">
            <div className="bg-gray-900 p-3 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128A8.97 8.97 0 0 1 12 19.5a8.97 8.97 0 0 1-3-.372m6 0A8.944 8.944 0 0 1 12 21a8.964 8.964 0 0 1-3-.499M9 19.128c-.5-.91-.786-1.957-.786-3.07m0 0A8.986 8.986 0 0 1 12 12c1.354 0 2.64.305 3.786.855M8.839 15.555a9.348 9.348 0 0 0-4.025 1.148 4.125 4.125 0 0 0 7.533 2.493M8.839 15.555l3.375 6m-3.375-6a5.247 5.247 0 0 1 1.108-1.793M19.875 7.5a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0zm-11.25 0a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0z" />
              </svg>
            </div>
            <div className="ml-4 text-left">
              <h2 className="text-black font-medium">Total Mano de Obra</h2>
              <p className="text-black text-2xl font-bold">0</p>
            </div>
          </div>
  
        </div>

      <div className="flex gap-4">
        <div className="flex-grow p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-5">Task Table</h2>
          <TaskList tasks={tasks} />
        </div>

        <div className="w-1/4 p-6shadow-md rounded-lg">
          <RecientClient clients={clients} onDeleteClient={handleDeleteClient} />
        </div>
      </div>
    </div>
  );
};

export default Home;
