  import React, { useState, useEffect } from 'react';
  import { useParams } from 'react-router-dom';
  import axios from 'axios';
  import Breadcrumb from '../../../../general/Breadcrumb';
  import BuscadorMateriales from './BuscadorMateriales';
  import TablaMaterialesSeleccionados from './TablaMaterialesSeleccionados';

  const ListaMaterialesPage = () => {
  const { projectId } = useParams();
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [totalLista, setTotalLista] = useState(0);

  // Calcular total
  const calcularTotal = (materiales) => {
    return materiales.reduce((total, material) => {
      return total + (parseFloat(material.cantidad) * parseFloat(material.current_value));
    }, 0);
  };

  useEffect(() => {
    setTotalLista(calcularTotal(materialesSeleccionados));
  }, [materialesSeleccionados]);

  // Función para buscar materiales
  const searchMaterials = async (term) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/lista/search?term=${term}`);
      return response.data;
    } catch (error) {
      console.error('Error buscando materiales:', error);
      return [];
    }
  };

  // Función para obtener lista de materiales del proyecto
  const getProjectMaterials = async (projectId) => {
    if (!projectId) return { detalles: [] };
    try {
      const response = await axios.get(`http://localhost:5000/api/lista-materiales/project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo materiales del proyecto:', error);
      return { detalles: [] };
    }
  };

  // Cargar datos del proyecto y sus materiales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Obtener datos del proyecto
        const projectResponse = await axios.get(`http://localhost:5000/api/projects`);
        const projectData = projectResponse.data.find(p => p.project_id === parseInt(projectId));
        if (projectData) {
          setProject(projectData);

          // Cargar materiales del proyecto
          const materialesData = await getProjectMaterials(projectId);
          setMaterialesSeleccionados(materialesData.detalles || []);
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const handleAddMaterial = (material) => {
    if (!materialesSeleccionados.some(m => m.material_id === material.material_id)) {
      const newMaterial = {
        ...material,
        cantidad: 1,
        subtotal: parseFloat(material.current_value)
      };
      setMaterialesSeleccionados([...materialesSeleccionados, newMaterial]);
    }
  };

  const handleUpdateCantidad = (materialId, cantidad) => {
    const cantidadNum = parseFloat(cantidad);
    if (isNaN(cantidadNum) || cantidadNum <= 0) return;
    
    setMaterialesSeleccionados(materialesSeleccionados.map(material => {
      if (material.material_id === materialId) {
        return {
          ...material,
          cantidad: cantidadNum,
          subtotal: cantidadNum * parseFloat(material.current_value)
        };
      }
      return material;
    }));
    };
  // Agregar la función handleRemoveMaterial
  const handleRemoveMaterial = (materialId) => {
    setMaterialesSeleccionados(
      materialesSeleccionados.filter(material => material.material_id !== materialId)
    );
  };// ListaMaterialesPage.jsx

  const handleSaveList = async () => {
  try {
    // Validaciones previas
    if (!projectId) {
      alert('No se ha especificado un proyecto');
      return;
    }

    if (materialesSeleccionados.length === 0) {
      alert('Debe seleccionar al menos un material');
      return;
    }

    // Preparar los datos
    const items = materialesSeleccionados.map(material => {
      const cantidad = parseFloat(material.cantidad);
      const precio_unitario = parseFloat(material.current_value);

      if (isNaN(cantidad) || cantidad <= 0) {
        throw new Error(`Cantidad inválida para ${material.description}`);
      }

      if (isNaN(precio_unitario) || precio_unitario <= 0) {
        throw new Error(`Precio inválido para ${material.description}`);
      }

      return {
        material_id: material.material_id,
        cantidad: cantidad,
        precio_unitario: precio_unitario
      };
    });

    const requestData = {
      project_id: parseInt(projectId),
      items: items
    };

    // Log de datos a enviar
    console.log('Datos a enviar:', JSON.stringify(requestData, null, 2));

    // Realizar la petición
    const response = await axios.post(
      'http://localhost:5000/api/lista-materiales',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Respuesta exitosa:', response.data);
    alert('Lista guardada exitosamente');

    // Recargar la lista
    const materialesData = await getProjectMaterials(projectId);
    setMaterialesSeleccionados(materialesData.detalles || []);

  } catch (error) {
    console.error('Error completo:', error);

    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
      alert(error.response.data.detail || error.response.data.error || 'Error al guardar la lista');
    } else if (error.message) {
      alert(error.message);
    } else {
      alert('Error desconocido al guardar la lista');
    }
  }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-800"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="rounded-lg p-5">
        <Breadcrumb />

        <div className="bg-white p-5 rounded-lg shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Lista de Materiales - {project?.project_name}
            </h2>
            <BuscadorMateriales 
              onMaterialSelect={handleAddMaterial} 
              searchMaterials={searchMaterials}
            />
          </div>

          <TablaMaterialesSeleccionados 
            materiales={materialesSeleccionados}
            onUpdateCantidad={handleUpdateCantidad}
            onRemoveMaterial={handleRemoveMaterial}
          />

          {materialesSeleccionados.length > 0 && (
            <div className="mt-4">
              <div className="text-right mb-4">
                <span className="font-bold">Total: </span>
                <span className="text-red-600">
                  {new Intl.NumberFormat('es-CL', { 
                    style: 'currency', 
                    currency: 'CLP' 
                  }).format(totalLista)}
                </span>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSaveList}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Guardar Lista
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  };

  export default ListaMaterialesPage;