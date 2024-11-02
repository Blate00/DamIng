import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DocumentTextIcon, FolderIcon } from '@heroicons/react/solid';
import Breadcrumb from '../../../general/Breadcrumb';
import axios from 'axios'; // Ensure Axios is imported

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

        // Fetch documents and project name from the local API
        const response = await axios.get(`http://localhost:5000/api/archives/${projectId}`);
        const { documents, projectName } = response.data;

        // Log the response to verify the structure
        console.log(documents); // Check the structure of documents

        setDocuments(documents);
        setProjectName(projectName);
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
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#F3E7E9] to-[#E3EEFF]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#700F23]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#F3E7E9] to-[#E3EEFF]">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E7E9] to-[#E3EEFF]">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl overflow-hidden">
          <div className="p-5">
            <Breadcrumb className="mb-6 text-sm text-gray-500" />
            <div className="flex items-center mb-5 pb-3">
              <div className="bg-[#700F23] rounded-full p-3 mr-4">
                <FolderIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Documentos: <span className="text-[#700F23]">{projectName}</span>
              </h2>
            </div>
            {documents.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-xl font-medium text-gray-600">No hay documentos disponibles para este proyecto</p>
                <p className="mt-2 text-sm text-gray-500">Los documentos aparecerán aquí una vez que se añadan al proyecto.</p>
              </div>
            ) : (
              <ul className="space-y-4 bg-white rounded-lg p-4">
                {documents.map((document) => {
                  // Accessing the correct property for document name
                  const documentName = document.nombre_documento || 'Documento sin tipo';
                  const documentTypeRoute = documentRoutes[document.nombre_documento] || 'default';
                  return (
                    <li key={document.document_id} className="group">
                      <Link
                        to={`/clients/${documentTypeRoute}/${id}/${projectId}`}
                        className="flex items-center p-5 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:bg-white group-hover:ring-2 group-hover:ring-[#700F23] group-hover:ring-opacity-50"
                      >
                        <div className="flex-shrink-0 mr-4">
                          <div className="bg-white rounded-lg p-2 shadow-md group-hover:shadow-lg transition-all duration-300">
                            <DocumentTextIcon className="h-8 w-8 text-[#700F23]" />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-[#700F23] transition-colors duration-300">
                            {documentName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Subido el: {new Date(document.upload_date).toLocaleDateString()}
                          </p>
                        </div>
                        <svg className="h-6 w-6 text-gray-400 group-hover:text-[#700F23] group-hover:transform group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Archives;