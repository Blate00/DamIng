import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FolderIcon, DotsVerticalIcon } from '@heroicons/react/outline';

const ListadoTrabajos = () => {
  const { id } = useParams();
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients[id];
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedFilter, setSelectedFilter] = useState('Estado');
  if (!client) {
    return <div className="p-6">Cliente no encontrado</div>;
  }

  const handleDotsClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleDelete = (jobIndex) => {
    client.jobs.splice(jobIndex, 1);
    localStorage.setItem('clients', JSON.stringify(clients));
    setOpenIndex(null);
  };

  const handleDownload = (jobIndex) => {
    alert(`Descargar archivos para el trabajo: ${client.jobs[jobIndex].name}`);
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
    <div className="flex flex-col p-3">

      <ul className="uwu2 w-full rounded-lg p-5">   
           <div className="flex flex-row items-center space-x-3 mb-4 p-">
        <input 
          type="text" 
          placeholder="Buscar Cliente" 
          className="p-2 border rounded-lg flex-grow"
        />

        {/* Filtro de Períodos */}
        <select 
          value={selectedPeriod} 
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="p-2 border rounded-lg"
          placeholder="Buscar Cliente" 

        >
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          {/* Agrega más períodos según sea necesario */}
        </select>

        {/* Filtro de Cursos */}
        <select 
          value={selectedFilter} 
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value=" Mes">Estado</option>
          <option value="Iniciado">Iniciado</option>
          <option value="No Iniciado">No Iniciado</option>
          <option value="Finalizado">Finalizado</option>
          {/* Agrega más filtros según sea necesario */}
        </select>
      </div>
      <div className="">
   
      <h2 className="text-xl font-semibold mb-4">Trabajos Registrados</h2> 
        {client.jobs.map((job, index) => (
          <li key={index} className="bg-gray-50 p-3 rounded-lg flex mb-1 items-center justify-between relative ">
            <Link to={`/archives/${id}`} className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <FolderIcon className="h-8 w-8 text-gray-500 mr-2" />
                <div>
                  <h3 className="font-semibold">{job.name}</h3>
                </div>
              </div>
              <div>
                <h3 className="ultmod opacity-25">{`Modificado: ${job.date}`}</h3>
              </div>
            </Link>

            <DotsVerticalIcon
              className="h-6 w-6 text-gray-500 cursor-pointer"
              onClick={() => handleDotsClick(index)}
            />
            {openIndex === index && (
              <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(index)}
                >
                  Eliminar
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                  onClick={() => handleDownload(index)}
                >
                  Descargar Archivos
                </button>
              </div>
            )}
          </li>
        ))}</div>
      </ul>
    </div>
  );
};

export default ListadoTrabajos;
