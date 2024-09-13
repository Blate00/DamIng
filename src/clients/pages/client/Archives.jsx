import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/outline';
import Breadcrumb from '../../../general/Breadcrumb';
import { supabase } from '../../../supabase/client'; // Asegúrate de importar tu cliente de Supabase

const Archives = () => {
  const { projectId } = useParams(); // Obtén el ID del proyecto
  const [documents, setDocuments] = useState([]); // Estado para almacenar los documentos
  const [loading, setLoading] = useState(true); // Estado para mostrar que los datos están cargando
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        if (!projectId) {
          throw new Error('ID del proyecto no proporcionado');
        }

        const { data, error } = await supabase
          .from('documents') // Nombre de la tabla en Supabase
          .select('*, tipo_document(url, nombre_documento)') // Selecciona todos los campos y el nombre del documento junto con el URL
          .eq('project_id', parseInt(projectId)); // Filtra por el project_id, asegurándote de que sea un número

        if (error) { 
          throw error; // Lanza el error si ocurre uno
        }

        setDocuments(data); // Almacena los documentos obtenidos
      } catch (error) {
        console.error('Error al cargar los documentos:', error);
        setError(error.message); // Guarda el mensaje de error
      } finally {
        setLoading(false); // Termina la carga
      }
    };

    fetchDocuments(); // Llamamos a la función cuando se monta el componente
  }, [projectId]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Cargando documentos...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  if (documents.length === 0) {
    return <div className="p-6 text-center text-gray-500">No hay documentos disponibles para este proyecto</div>;
  }

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg">
        <div className="p-5">
          <Breadcrumb />
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Documentos del Proyecto {projectId}</h2>
          <ul className="space-y-2">
            {documents.map((document) => (
              <li key={document.document_id}>
                <div className="flex mb-2 items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8 text-red-600 mr-4" />
                    <div>
                      <h3 className="text-md font-semibold text-gray-800">
                        {document.tipo_document.nombre_documento}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {`Subido el: ${new Date(document.upload_date).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`${document.tipo_document.url.replace(':projectId', projectId)}`}
                    className="h-6 w-6 text-gray-800 cursor-pointer hover:text-blue-800"
                  >
                    <DownloadIcon className="h-6 w-6 text-gray-800 cursor-pointer hover:text-blue-800" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Archives;
