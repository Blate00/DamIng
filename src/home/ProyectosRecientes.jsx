import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase/client';
import { Link } from 'react-router-dom';
    import { FolderIcon } from '@heroicons/react/outline';

const ProyectosRecientes = () => {
  const [projects, setProjects] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);

  // Función para obtener los proyectos desde la base de datos
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
        `);

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
    <ul className="space-y-4 mt-6 ">
      {projects.length > 0 ? (
        projects.map((project, index) => (
          <li key={project.project_id} className="bg-gray-50 rounded-lg hover:shadow-lg transition-shadow duration-300">
            <div className="relative flex items-center justify-between p-4">
              <Link to={`/clients/archives/${project.clients.client_id}/${project.project_id}`} className="flex items-center flex-grow space-x-4">
                <div className="bg-[#700F23] p-2 rounded-full">
                  <FolderIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-m font-semibold text-black mb-1">{project.project_name}</h3>
                </div>
              </Link>
             
          
            </div>
          </li>
        ))
      ) : (
        <p className="text-gray-500 text-center">No hay proyectos disponibles.</p>
      )}
    </ul>
  );
};

export default ProyectosRecientes;
