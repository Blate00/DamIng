import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/outline';
import Breadcrumb from '../../../general/Breadcrumb';
import { supabase } from '../../../supabase/client'; // Asegúrate de importar tu cliente de Supabase

const Archives = () => {
  const { id } = useParams(); // Obtén el ID del proyecto
  const [documents, setDocuments] = useState([]); // Estado para almacenar los documentos
  const [loading, setLoading] = useState(true); // Estado para mostrar que los datos están cargando
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { data, error } = await supabase
          .from('documents') // Nombre de la tabla en Supabase
          .select('*') // Selecciona todos los campos
          .eq('project_id', id); // Filtra por el project_id

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
  }, [id]);

  const handleDownload = (filename) => {
    alert(`Descargando archivo: ${filename}`);
    // Aquí podrías integrar la lógica real para descargar el archivo.
  };

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
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Documentos del Proyecto {id}</h2>
          <ul className="space-y-2">
            {documents.map((document) => (
              <li key={document.project_id}>
                <div className="flex mb-2 items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8 text-red-600 mr-4" />
                    <div>
                      <h3 className="text-md font-semibold text-gray-800">
                        {document.document_type}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {`Subido el: ${new Date(document.upload_date).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <DownloadIcon
                    className="h-6 w-6 text-gray-800 cursor-pointer hover:text-blue-800"
                    onClick={() => handleDownload(document.quote_number)}
                  />
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
