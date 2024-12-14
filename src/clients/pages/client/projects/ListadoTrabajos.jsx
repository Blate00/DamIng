import React, { useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import { FolderIcon, SearchIcon, CalendarIcon, FilterIcon } from '@heroicons/react/outline';
import Breadcrumb from '../../../../general/Breadcrumb';
import axios from 'axios';
import ProjectForm from './components/ProjectForm';
import { PlusIcon } from '@heroicons/react/outline';

const ListadoTrabajos = () => {
const { client_id } = useParams();
const [projects, setProjects] = useState([]);
const [selectedPeriod, setSelectedPeriod] = useState('2024');
const [selectedFilter, setSelectedFilter] = useState('Estado');
const [searchQuery, setSearchQuery] = useState('');
const [loading, setLoading] = useState(true);
const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
const [client, setClient] = useState(null);

const handleProjectAdded = (newProject) => {
  setProjects([...projects, newProject]);
};

const handleStatusChange = async (projectId, newStatus) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];
    let updateData = {
      status: newStatus
    };

    if (newStatus === 'En Progreso') {
      updateData.start_date = currentDate;
    } else if (newStatus === 'Finalizado') {
      updateData.end_date = currentDate;
    }

    const response = await axios.put(
      `http://localhost:5000/api/projects/${projectId}/status`,
      updateData
    );

    setProjects(projects.map(project => 
      project.project_id === projectId 
        ? { ...project, ...response.data }
        : project
    ));

  } catch (error) {
    console.error('Error updating project status:', error);
    alert('Error al actualizar el estado del proyecto');
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'No Iniciado':
      return 'bg-gray-200 text-gray-800';
    case 'En Progreso':
      return 'bg-blue-200 text-blue-800';
    case 'Finalizado':
      return 'bg-green-200 text-green-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [clientResponse, projectsResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/clients`),
        axios.get(`http://localhost:5000/api/projects`, {
          params: { client_id }
        })
      ]);

      const clientData = clientResponse.data.find(c => c.client_id === parseInt(client_id));
      setClient(clientData);
      setProjects(projectsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [client_id]);

const filteredProjects = projects
  .filter(project => project.project_name.toLowerCase().includes(searchQuery.toLowerCase()))
  .filter(project => selectedFilter === 'Estado' || project.status === selectedFilter);

return (
  <div className="flex flex-col p-5 h-full">
    <div className="h-full rounded-lg">
      <Breadcrumb />

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
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
            <option value="No Iniciado">No Iniciado</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Finalizado">Finalizado</option>
          </select>
          <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className='rounded-lg bg-white p-6 shadow-md'>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Proyectos</h1>
          <button 
            onClick={() => setIsProjectFormOpen(true)}
            className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-colors duration-200 flex items-center"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>

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
                    <p className="text-sm text-gray-600">{project.quote_number}</p>
                    {project.start_date && (
                      <p className="text-sm text-gray-600">Inicio: {new Date(project.start_date).toLocaleDateString()}</p>
                    )}
                    {project.end_date && (
                      <p className="text-sm text-gray-600">Fin: {new Date(project.end_date).toLocaleDateString()}</p>
                    )}
                  </div>
                </Link>
                <select
                  value={project.status}
                  onChange={(e) => handleStatusChange(project.project_id, e.target.value)}
                  className={`ml-4 p-2 border rounded-md focus:ring-red-500 focus:border-red-500 ${getStatusColor(project.status)}`}
                >
                  <option value="No Iniciado">No Iniciado</option>
                  <option value="En Progreso">En Progreso</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

    <ProjectForm 
      clientId={client_id}
      client={client}
      isOpen={isProjectFormOpen}
      onClose={() => setIsProjectFormOpen(false)}
      onProjectAdded={handleProjectAdded}
    />
  </div>
);
};

export default ListadoTrabajos;