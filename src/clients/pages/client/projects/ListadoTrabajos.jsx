import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FolderIcon, SearchIcon, CalendarIcon, FilterIcon } from '@heroicons/react/outline';
import Breadcrumb from '../../../../general/Breadcrumb';
import axios from 'axios';

const ListadoTrabajos = () => {
  const { client_id } = useParams(); // Obtener client_id de la URL
  const [projects, setProjects] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedFilter, setSelectedFilter] = useState('Estado');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        // Llama a la nueva ruta para obtener proyectos filtrados por client_id
        const projectsResponse = await axios.get(`http://localhost:5000/api/projects`, {
          params: { client_id } // Pasar client_id como parámetro de consulta
        });
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error('Error fetching projects:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [client_id]); // Dependencia de client_id para volver a ejecutar el efecto si cambia

  const filteredProjects = projects
    .filter(project => project.project_name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(project => selectedFilter === 'Estado' || project.status === selectedFilter);

  return (
    <div className="flex flex-col p-5 h-full">
      <div className="h-full rounded-lg">
        <Breadcrumb />

        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
          <div className="relative flex-grow mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Buscar Proyecto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#700F23] transition duration-150 ease-in-out"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <div className="relative mb-4 md:mb-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#700F23] transition duration-150 ease-in-out"
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <div className="relative">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="appearance-none w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#700F23] transition duration-150 ease-in-out"
            >
              <option value="Estado">Estado</option>
              <option value="Iniciado">Iniciado</option>
              <option value="No Iniciado">No Iniciado</option>
              <option value="Finalizado">Finalizado</option>
            </select>
            <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className='rounded-lg bg-white p-6 shadow-md'>
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Proyectos</h1>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#700F23]"></div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <li key={project.project_id} className="flex items-center justify-between py-4 hover:bg-gray-100 p-3 rounded-lg transition-colors duration-200">
                  <Link to={`/clients/archives/${project.client_id}/${project.project_id}`} className="flex items-center space-x-4">
                    <div className="bg-red-600 p-3 rounded-full">
                      <FolderIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-1">{project.project_name}</h3>
                      <p className="text-sm text-gray-600">{`Inicio: ${project.start_date}`}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListadoTrabajos;