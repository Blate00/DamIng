import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderIcon, ChevronRightIcon } from '@heroicons/react/solid';

const ProyectosRecientes = () => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          project_id,
          project_name,
          quote_number,
          status,
          start_date,
          end_date,
          clients:client_id (client_id, name)
        `)
        .order('start_date', { ascending: false })
        .limit(5);

      if (error) throw error;
      setProjects(data);
    } catch (error) {
      console.error('Error al obtener los proyectos:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="">
      <ul className="space-y-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <li key={project.project_id} className="group">
              <Link 
                to={`/clients/archives/${project.clients.client_id}/${project.project_id}`} 
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-red-600 to-red-800 p-2 rounded-full group-hover:shadow-md transition-all duration-300">
                    <FolderIcon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="text-sm font-medium text-gray-800 group-hover:text-red-700 transition-colors duration-300">{project.project_name}</h3>
                  <p className="text-xs text-gray-500">{project.clients.name}</p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
              </Link>
            </li>
          ))
        ) : (
          <li className="text-center py-4">
            <p className="text-gray-500">No hay proyectos disponibles.</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ProyectosRecientes;