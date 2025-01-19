import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../../../general/Breadcrumb';
import TablaMaterialesSeleccionados from './TablaMaterialesSeleccionados';
import DescargarPDF from './Dpdf';
import { FaSave, FaPlus } from 'react-icons/fa';

const StandaloneMaterialList = () => {
  const [materials, setMaterials] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useParams();
  const [client, setClient] = useState(null);
  const [job, setJob] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const materialListResponse = await axios.get(
        `http://localhost:5000/api/material-lists/project-with-availables/${projectId}`
      );
  
      const mappedMaterials = materialListResponse.data.map(material => ({
        ...material,
        quantity: material.list_id ? material.quantity : 1,
        unit_value: material.current_value,
        in_database: !!material.list_id, // Marcar si ya está en la base de datos
        is_selected: false // Resetear selección para nuevos materiales
      }));
  
      setMaterials(mappedMaterials);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError('Error al cargar los materiales: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const jobResponse = await axios.get('http://localhost:5000/api/projects');
        const projectData = jobResponse.data.find(
          (project) => project.project_id === parseInt(projectId)
        );
        if (!projectData) {
          throw new Error("No se encontró el proyecto");
        }
        setJob(projectData);

        const clientResponse = await axios.get('http://localhost:5000/api/clients/');
        const clientData = clientResponse.data.find(
          (client) => client.client_id === projectData.client_id
        );
        if (!clientData) {
          throw new Error("No se encontró el cliente");
        }
        setClient(clientData);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter((material) => {
    return (
      selectedCategories.length === 0 || selectedCategories.includes(material.category)
    );
  });

  const formatCLP = (value) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };

  const totalMoney = filteredMaterials.reduce(
    (sum, material) => sum + material.current_value * material.quantity,
    0
  );

  const totalMaterials = filteredMaterials.reduce(
    (sum, material) => sum + material.quantity,
    0
  );
  const handleSaveMaterialList = async () => {
    try {
      setSaving(true);
      
      const materialsToSave = filteredMaterials
        .filter(material => material.in_database || material.is_selected)
        .map(material => ({
          material_id: material.material_id,
          quantity: material.quantity || 1,
          unit_value: material.current_value || 0
        }));
  
      if (materialsToSave.length === 0) {
        alert('Por favor, seleccione al menos un material para guardar.');
        return;
      }
  
      const response = await axios.post('http://localhost:5000/api/material-lists', {
        project_id: parseInt(projectId),
        quote_number: job?.quote_number,
        materials: materialsToSave
      });
  
      if (response.data) {
        alert('Lista de materiales guardada exitosamente');
        await fetchMaterials(); // Recargar los materiales desde el servidor
      }
    } catch (error) {
      console.error('Error saving material list:', error);
      alert('Error al guardar la lista de materiales: ' +
        (error.response?.data?.details || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-5 h-full">
      <div className="h-full rounded-lg">
        <Breadcrumb />

        <div className="p-4 bg-white shadow-md rounded-tl-lg rounded-tr-lg border-l-4 border-red-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-900 font-semibold text-lg">Cliente:</p>
              <p className="text-gray-800 text-base">{client?.name}</p>

              <div className="mt-4">
                <p className="text-gray-900 font-semibold text-lg">Proyecto:</p>
                <p className="text-gray-800 text-base">{job?.project_name}</p>
              </div>
            </div>

          </div>
        </div>

        <div className="p-5 bg-white rounded-b-xl border-l-4 border-red-800">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Lista de Materiales</h2>
            <div className="mt- text-end flex space-x-4">
              <button
                className="flex items-center space-x-2 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                onClick={handleSaveMaterialList}
                disabled={saving}
              >
                <FaSave className="text-lg" />
              </button>

              <button
                className="flex items-center space-x-2 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"

              >
                <FaPlus className="text-lg" />
              </button>

              <DescargarPDF
                materiales={materials.filter(m => m && m.material_id)}
                selectedQuantities={materials.reduce((acc, material) => ({
                  ...acc,
                  [material.material_id]: material.quantity || 1
                }), {})}
                totals={{
                  totalQuantity: totalMaterials,
                  totalAmount: totalMoney
                }}
                formatCLP={formatCLP}
                client={client}
                job={job}
              />
            </div>



          </div>

          <TablaMaterialesSeleccionados
  materiales={materials}
  onMaterialsChange={(updatedMaterials) => {
    setMaterials(updatedMaterials);
  }}
/>
        </div>
      </div>
    </div>
  );
};

export default StandaloneMaterialList;    