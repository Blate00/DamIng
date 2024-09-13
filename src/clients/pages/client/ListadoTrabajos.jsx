import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FolderIcon, DotsVerticalIcon } from '@heroicons/react/outline';
import Breadcrumb from '../../../general/Breadcrumb';
import { supabase } from '../../../supabase/client';  // Asegúrate de que la ruta sea correcta

const ListadoTrabajos = () => {
  const { id } = useParams(); // `id` es `client_id`
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedFilter, setSelectedFilter] = useState('Estado');
  const [searchQuery, setSearchQuery] = useState('');

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
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('project_id', project_id);

      if (error) throw error;

      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.project_id === project_id ? { ...project, status: newStatus } : project
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
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <input
              type="text"
              placeholder="Buscar Proyecto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-red-800 flex-grow mb-3 md:mb-0"
            />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm mb-1 md:mb-0"
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
        <div className="rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Proyectos Registrados</h2>
          <ul className="space-y-2">
            {filteredProjects.map((project, index) => (
              <li key={project.project_id} className="relative flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Link to={`/clients/archives/${id}/${project.project_id}`} className="flex items-center flex-grow space-x-4">
                  <FolderIcon className="h-6 w-6 text-gray-600" />
                  <div className="flex-1">
                    <h3 className="text-md font-semibold text-gray-800 mb-1">{project.project_name}</h3>
                    <p className="text-xs text-gray-600">{`Inicio: ${project.start_date}`}</p>
                  </div>
                </Link>
                <div className="flex items-center space-x-4">
                  <select
                    value={project.status}
                    onChange={(e) => handleStatusChange(project.project_id, e.target.value)}
                    className="p-1 border border-gray-300 rounded-lg shadow-sm bg-white text-sm"
                  >
                    <option value="Iniciado">Iniciado</option>
                    <option value="No Iniciado">No Iniciado</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                  <DotsVerticalIcon
                    className="h-6 w-6 text-gray-600 cursor-pointer"
                    onClick={() => handleDotsClick(index)}
                  />
                </div>
                {openIndex === index && (
                  <div ref={dropdownRef} className="absolute right-2 top-10 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                    <button
                      className="block w-full text-left px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(project.project_id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="block w-full text-left px-3 py-1 text-xs text-blue-600 hover:bg-blue-50"
                      onClick={() => handleDownload(project.project_id)}
                    >
                      Descargar Archivos
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ListadoTrabajos;
