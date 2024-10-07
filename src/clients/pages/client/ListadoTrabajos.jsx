import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FolderIcon, DotsVerticalIcon, SearchIcon, CalendarIcon, FilterIcon } from '@heroicons/react/outline';
import Breadcrumb from '../../../general/Breadcrumb';
import { supabase } from '../../../supabase/client';

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

  const handleDotsClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleDelete = async (project_id) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('project_id', project_id);

      if (error) throw error;

      setProjects(prevProjects => prevProjects.filter(project => project.project_id !== project_id));
      setOpenIndex(null);
    } catch (error) {
      console.error('Error deleting project:', error.message);
    }
  };

  const handleDownload = (project_id) => {
    alert(`Descargar archivos para el proyecto: ${project_id}`);
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

  const handleStatusChange = async (project_id, newStatus) => {
    try {
      let updateData = { status: newStatus };
      const currentDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

      if (newStatus === 'Iniciado') {
        updateData.start_date = currentDate;
      } else if (newStatus === 'Finalizado') {
        updateData.end_date = currentDate;
      }

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('project_id', project_id);

      if (error) throw error;

      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.project_id === project_id ? { ...project, ...updateData } : project
        )
      );
    } catch (error) {
      console.error('Error updating project status:', error.message);
    }
  };

  const filteredProjects = projects
    .filter(project => project.project_name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(project => selectedFilter === 'Estado' || project.status === selectedFilter);

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg">
        <div className="p-5">
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
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Proyectos Registrados</h1>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#700F23]"></div>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredProjects.map((project, index) => (
                <li key={project.project_id} className="bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
                  <div className="relative flex items-center justify-between p-4">
                    <Link to={`/clients/archives/${id}/${project.project_id}`} className="flex items-center flex-grow space-x-4">
                      <div className="bg-[#700F23] p-2 rounded-full">
                        <FolderIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-black mb-1">{project.project_name}</h3>
                        <p className="text-sm text-gray-600">{`Inicio: ${project.start_date}`}</p>
                      </div>
                    </Link>
                    <div className="flex items-center space-x-4">
                    <select
      value={project.status}
      onChange={(e) => handleStatusChange(project.project_id, e.target.value)}
      className="p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#700F23]"
    >
                        <option value="Iniciado">Iniciado</option>
                        <option value="No Iniciado">No Iniciado</option>
                        <option value="Finalizado">Finalizado</option>
                      </select>
                      <button onClick={() => handleDotsClick(index)} className="focus:outline-none">
                        <DotsVerticalIcon className="h-6 w-6 text-gray-600 hover:text-[#700F23]" />
                      </button>
                    </div>
                    {openIndex === index && (
                      <div ref={dropdownRef} className="absolute right-2 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
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