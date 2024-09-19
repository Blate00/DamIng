import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DocumentTextIcon, FolderIcon } from '@heroicons/react/solid';
import Breadcrumb from '../../../general/Breadcrumb';
import { supabase } from '../../../supabase/client';

const Archives = () => {
  const { projectId, id } = useParams();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectName, setProjectName] = useState('');

  const documentRoutes = {
    Presupuesto: 'presupuesto',
    Rendición: 'rendicion',
    ListaMateriales: 'materiales',
    Flujo: 'flujo',
  };

  useEffect(() => {
    const fetchDocumentsAndProjectName = async () => {
      try {
        if (!projectId || !id) {
          throw new Error('ID del proyecto o cliente no proporcionado');
        }

        const [documentsResponse, projectResponse] = await Promise.all([
          supabase
            .from('documents')
            .select('*, tipo_document(nombre_documento)')
            .eq('project_id', parseInt(projectId)),
          supabase
            .from('projects')
            .select('project_name')
            .eq('project_id', parseInt(projectId))
            .single()
        ]);

        if (documentsResponse.error) throw documentsResponse.error;
        if (projectResponse.error) throw projectResponse.error;

        setDocuments(documentsResponse.data);
        setProjectName(projectResponse.data.project_name);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentsAndProjectName();
  }, [projectId, id]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#F3E7E9] to-[#E3EEFF]">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#700F23]"></div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#F3E7E9] to-[#E3EEFF]">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700">{error}</p>
      </div>
    </div>;
  }

  return (
    <div className="flex flex-col  bg-white h-full ">
      <div className="bg-white rounded-xl ">
        <div className="p-8">
          <Breadcrumb />
          <div className="flex items-center mb-6">
            <FolderIcon className="h-10 w-10 text-gray-800 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">
              Documentos: {projectName}
            </h2>
          </div>
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600">No hay documentos disponibles para este proyecto</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {documents.map((document) => {
                const documentTypeRoute = documentRoutes[document.tipo_document.nombre_documento] || 'default';
                return (
                  <li key={document.document_id}>
                    <Link 
                      to={`/clients/${documentTypeRoute}/${id}/${projectId}`}
                      className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <DocumentTextIcon className="h-10 w-10 text-[#700F23] mr-4" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {document.tipo_document.nombre_documento}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Subido el: {new Date(document.upload_date).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Archives;