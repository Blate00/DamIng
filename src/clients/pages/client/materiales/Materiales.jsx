import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../../../general/Breadcrumb'; // Importar el componente Breadcrumb  
import TablaMaterialesSeleccionados from './TablaMaterialesSeleccionados'; 

const StandaloneMaterialList = () => {
  const [materials, setMaterials] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projectId } = useParams();
  const [client, setClient] = useState(null);
  const [job, setJob] = useState(null);
  const [saving, setSaving] = useState(false);
  // Fetch materials from the API    
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      // Primero intentamos obtener la lista específica del proyecto  
      const materialListResponse = await axios.get(`http://localhost:5000/api/material-lists/project/${projectId}`);

      if (materialListResponse.data.length > 0) {
        setMaterials(materialListResponse.data);
      } else {
        // Si no hay lista específica, obtener todos los materiales  
        const response = await axios.get('http://localhost:5000/api/materials');
        setMaterials(response.data.map(material => ({
          ...material,
          quantity: 1,
          unit_value: material.current_value
        })));
      }
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

        // Obtener datos del proyecto    
        const jobResponse = await axios.get('http://localhost:5000/api/projects');
        const projectData = jobResponse.data.find(
          (project) => project.project_id === parseInt(projectId)
        );
        if (!projectData) {
          throw new Error("No se encontró el proyecto");
        }
        setJob(projectData);

        // Obtener datos del cliente    
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

  // Handle deleting a material    
  const handleDeleteMaterial = async (materialId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este material?')) {
      try {
        await axios.delete(`http://localhost:5000/api/materials/${materialId}`);
        fetchMaterials(); // Refresh the list after deleting    
      } catch (error) {
        console.error('Error deleting material:', error);
      }
    }
  };

  // Get unique categories for filtering    
  const uniqueCategories = [...new Set(materials.map((material) => material.category))];

  // Handle category selection    
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Filter materials based on selected categories    
  const filteredMaterials = materials.filter((material) => {
    return (
      selectedCategories.length === 0 || selectedCategories.includes(material.category)
    );
  });

  // Format currency to CLP    
  const formatCLP = (value) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };

  // Calculate total money and total materials    
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

      // Preparar los datos para enviar usando directamente las cantidades de materials  
      const materialsToSave = filteredMaterials.map(material => ({
        material_id: material.material_id,
        quantity: material.quantity || 1, // Usar la cantidad del material directamente  
        unit_value: material.current_value || 0
      }));

      console.log('Datos a enviar:', {
        project_id: parseInt(projectId),
        quote_number: job?.quote_number,
        materials: materialsToSave
      });

      const response = await axios.post('http://localhost:5000/api/material-lists', {
        project_id: parseInt(projectId),
        quote_number: job?.quote_number,
        materials: materialsToSave
      });

      if (response.data) {
        alert('Lista de materiales guardada exitosamente');
        await fetchMaterials();
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
        <Breadcrumb /> {/* Breadcrumb agregado */}

        <div className="p-4 bg-white shadow-md rounded-tl-lg rounded-tr-lg border-l-4 border-red-800">
          <p className="text-gray-900 font-semibold text-lg">Cliente:</p>
          <p className="text-gray-800 text-base">{client?.name}</p>

          <div className="mt-4">
            <p className="text-gray-900 font-semibold text-lg">Proyecto:</p>
            <p className="text-gray-800 text-base">{job?.project_name}</p>
          </div>
        </div>

        <div className="p-5 bg-white rounded-b-xl border-l-4 border-red-800">
         
            <h2 className="text-xl font-semibold text-gray-800">Lista de Materiales</h2>
            <button
              onClick={handleSaveMaterialList}
              disabled={saving}
              className={`px-4 py-2 rounded-md text-white ${saving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                } transition-colors`}
            >
              {saving ? 'Guardando...' : 'Guardar Lista'}
            </button>

          <TablaMaterialesSeleccionados
            materiales={filteredMaterials}
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