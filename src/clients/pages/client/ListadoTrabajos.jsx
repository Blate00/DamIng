import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FolderIcon, DotsVerticalIcon } from '@heroicons/react/outline';

const ListadoTrabajos = () => {
  const { id } = useParams();
  const [client, setClient] = useState(JSON.parse(localStorage.getItem('clients'))[id] || {});
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedFilter, setSelectedFilter] = useState('Estado');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updatedClients = JSON.parse(localStorage.getItem('clients')) || [];
    setClient(updatedClients[id]);
  }, [id]);

  useEffect(() => {
    if (client) {
      const updatedClients = JSON.parse(localStorage.getItem('clients')) || [];
      updatedClients[id] = client;
      localStorage.setItem('clients', JSON.stringify(updatedClients));
    }
  }, [client, id]);

  if (!client) {
    return <div className="p-4">Cliente no encontrado</div>;
  }

  const handleDotsClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleDelete = (jobIndex) => {
    const updatedJobs = client.jobs.filter((_, index) => index !== jobIndex);
    setClient(prevClient => ({ ...prevClient, jobs: updatedJobs }));
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

  const handleStatusChange = (jobIndex, newStatus) => {
    const updatedJobs = client.jobs.map((job, index) =>
      index === jobIndex ? { ...job, status: newStatus } : job
    );
    setClient(prevClient => ({ ...prevClient, jobs: updatedJobs }));
  };

  const filteredJobs = client.jobs
    .filter(job => job.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(job => selectedFilter === 'Estado' || job.status === selectedFilter);

  return (
    <div className="uwu3 flex flex-col p-3 bg-white h-full">
    <div className="bg-white  rounded-lg">
      <div className=" p-5   ">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 ">
          <input
            type="text"
            placeholder="Buscar Trabajo"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 flex-grow mb-3 md:mb-0"
          />

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm mb-3 md:mb-0"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>

          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm"
          >
            <option value="Estado">Estado</option>
            <option value="Iniciado">Iniciado</option>
            <option value="No Iniciado">No Iniciado</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>
      </div>
<div  className="rounded-lg p-4 100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Trabajos Registrados</h2>
      <ul className="space-y-2">
        {filteredJobs.map((job, index) => (
          <li key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <Link to={`/archives/${id}`} className="flex items-center flex-grow space-x-4">
              <FolderIcon className="h-6 w-6 text-gray-600" />
              <div className="flex-1">
                <h3 className="text-md font-semibold text-gray-800 mb-1">{job.name}</h3>
                <p className="text-xs text-gray-600">{`Modificado: ${job.date}`}</p>
              </div>
            </Link>
            <select
              value={job.status}
              onChange={(e) => handleStatusChange(index, e.target.value)}
              className="p-1 border border-gray-300 rounded-lg shadow-sm bg-white text-sm mr-9"
            >
              <option value="Iniciado">Iniciado</option>
              <option value="No Iniciado">No Iniciado</option>
              <option value="Finalizado">Finalizado</option>
            </select>
            <DotsVerticalIcon
              className="h-6 w-6 text-gray-600 cursor-pointer absolute  right-9"
              onClick={() => handleDotsClick(index)}
            />
            {openIndex === index && (
              <div ref={dropdownRef} className="absolute right-2 top-10 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                <button
                  className="block w-full text-left px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(index)}
                >
                  Eliminar
                </button>
                <button
                  className="block w-full text-left px-3 py-1 text-xs text-blue-600 hover:bg-blue-50"
                  onClick={() => handleDownload(index)}
                >
                  Descargar Archivos
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div></div></div>
  );
};

export default ListadoTrabajos;
