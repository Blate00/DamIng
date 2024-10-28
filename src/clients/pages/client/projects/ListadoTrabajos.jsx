import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FolderIcon, DotsVerticalIcon, SearchIcon, CalendarIcon, FilterIcon } from '@heroicons/react/outline';
import Breadcrumb from '../../../../general/Breadcrumb';
import ProjectForm from './components/ProjectForm';
const ListadoTrabajos = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedFilter, setSelectedFilter] = useState('Estado');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientAndProjects = async () => {
      try {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('client_id', id)
          .single();

        if (clientError) throw clientError;
        setClient(clientData);

        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('client_id', id);

        if (projectError) throw projectError;

        setProjects(projectData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientAndProjects();
  }, [id]);

  const onProjectAdded = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };
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
              {filteredProjects.map((project, index) => (
                <li key={project.project_id} className="flex items-center justify-between py-4 hover:bg-gray-100 p-3 rounded-lg transition-colors duration-200">

                  <Link to={`/clients/archives/${id}/${project.project_id}`} className="flex items-center space-x-4">
                    <div className="bg-red-600 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
                        <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
                      </svg>

                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-1">{project.project_name}</h3>
                      <p className="text-sm text-gray-600">{`Inicio: ${project.start_date}`}</p>
                    </div>
                  </Link>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <select
                        value={project.status}
                        onChange={(e) => handleStatusChange(project.project_id, e.target.value)}
                        className="appearance-none bg-gradient-to-r from-[#700F23] to-[#9A1432] py-2 px-4 pr-8 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#700F23] focus:ring-opacity-50"
                        style={{
                          color: 'white'
                        }}
                      >
                        <option value="Iniciado" style={{ color: project.status === 'Iniciado' ? 'white' : 'black' }}>Iniciado</option>
                        <option value="No Iniciado" style={{ color: project.status === 'No Iniciado' ? 'white' : 'black' }}>No Iniciado</option>
                        <option value="Finalizado" style={{ color: project.status === 'Finalizado' ? 'white' : 'black' }}>Finalizado</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => handleDotsClick(index)}
                        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#700F23] transition-all duration-300"
                      >
                        <DotsVerticalIcon className="h-5 w-5 text-gray-600 hover:text-[#700F23]" />
                      </button>
                      {openIndex === index && (
                        <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-150 ease-in-out"
                            onClick={() => handleDelete(project.project_id)}
                          >
                            Eliminar
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition duration-150 ease-in-out"
                            onClick={() => handleDownload(project.project_id)}
                          >
                            Descargar Archivos
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}    </div>
      </div>
    </div>

  );
};

export default ListadoTrabajos;