import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabase/client';
import Breadcrumb from '../../../general/Breadcrumb';
import ClientInfo from './components/ClientInfo';
import SelectedMaterialsTable from './components/SelectedMaterialsTable';
import MaterialSearch from './components/MaterialSearch';
import MaterialSummary from './components/MaterialSummary';

const Pmaterial = () => {
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const { id, projectId } = useParams();
  const [client, setClient] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientAndJob();
  }, [id, projectId]);

  useEffect(() => {
    if (projectId && job?.quote_number) {
      fetchExistingMaterials();
    }
  }, [projectId, job]);

  const fetchClientAndJob = async () => {
    try {
      setLoading(true);
      const clientData = await fetchClient(id);
      setClient(clientData);

      const jobData = await fetchJob(projectId);
      setJob(jobData);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClient = async (clientId) => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('client_id', clientId)
      .single();

    if (error) throw error;
    return data;
  };

  const fetchJob = async (jobId) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('project_id', jobId)
      .single();

    if (error) throw error;
    return data;
  };

  const fetchExistingMaterials = async () => {
    try {
      setLoading(true);
      // Verificar si ya existe la lista de materiales
      const { data: existingList, error: existingListError } = await supabase
        .from('lista_materiales')
        .select('*')
        .eq('project_id', projectId)
        .eq('quote_number', job.quote_number)
        .single();

      if (existingListError && existingListError.code !== 'PGRST116') {
        throw existingListError;
      }

      if (existingList) {
        // Obtener los detalles de los materiales junto con la categoría y la descripción
        const { data: detalles, error: detallesError } = await supabase
          .from('detalle_lista_materiales')
          .select(`
            *,
            materiales (
              description,
              category
            )
          `)
          .eq('lista_id', existingList.lista_id);

        if (detallesError) throw detallesError;

        setSelectedMaterials(
          detalles.map((detalle) => ({
            material_id: detalle.material_id,
            quantity: detalle.cantidad,
            current_value: detalle.precio_unitario,
            description: detalle.materiales.description,
            category: detalle.materiales.category,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching existing materials:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterialWithQuantity = (material, quantity) => {
    setSelectedMaterials((prevMaterials) => [...prevMaterials, { ...material, quantity }]);
  };

  const handleRemoveMaterial = (index) => {
    setSelectedMaterials((prevMaterials) => prevMaterials.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index, delta) => {
    setSelectedMaterials((prevMaterials) =>
      prevMaterials.map((material, i) =>
        i === index ? { ...material, quantity: Math.max(1, material.quantity + delta) } : material
      )
    );
  };

  const saveMaterialList = async () => {
    if (!projectId || !job?.quote_number) {
      alert('Información del proyecto incompleta. No se puede guardar la lista de materiales.');
      return;
    }

    // Calcular total de materiales y total de dinero
    const totalMateriales = selectedMaterials.reduce((acc, material) => acc + material.quantity, 0);
    const totalDinero = selectedMaterials.reduce(
      (acc, material) => acc + material.quantity * material.current_value,
      0
    );

    try {
      setLoading(true);

      // Verificar si ya existe la lista de materiales
      const { data: existingList, error: existingListError } = await supabase
        .from('lista_materiales')
        .select('*')
        .eq('project_id', projectId)
        .eq('quote_number', job.quote_number)
        .single();

      if (existingListError && existingListError.code !== 'PGRST116') {
        throw existingListError;
      }

      let listaId;

      if (existingList) {
        // Actualizar lista de materiales existente
        listaId = existingList.lista_id;
        const { error: updateError } = await supabase
          .from('lista_materiales')
          .update({
            total_materiales: totalMateriales,
            total_dinero: totalDinero,
          })
          .eq('lista_id', listaId);

        if (updateError) throw updateError;

        // Eliminar los detalles antiguos
        await supabase
          .from('detalle_lista_materiales')
          .delete()
          .eq('lista_id', listaId);
      } else {
        // Insertar una nueva lista de materiales
        const { data: listData, error: listError } = await supabase
          .from('lista_materiales')
          .insert({
            project_id: projectId,
            quote_number: job.quote_number,
            total_materiales: totalMateriales,
            total_dinero: totalDinero,
          })
          .select()
          .single();

        if (listError) throw listError;
        listaId = listData.lista_id;
      }

      // Insertar en detalle_lista_materiales
      const detallesInsert = selectedMaterials.map((material) => ({
        lista_id: listaId,
        material_id: material.material_id,
        cantidad: material.quantity,
        precio_unitario: material.current_value,
        subtotal: material.current_value * material.quantity,
      }));

      const { error: detallesError } = await supabase
        .from('detalle_lista_materiales')
        .insert(detallesInsert);

      if (detallesError) throw detallesError;

      alert('Lista de materiales guardada con éxito');
    } catch (error) {
      console.error('Error al guardar la lista de materiales:', error.message);
      setError(error.message);
      alert('Error al guardar la lista de materiales: ' + error.message);
    } finally {
      setLoading(false);
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

  if (!client || !job) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Datos no encontrados</h2>
          <p className="text-gray-700">No se pudo cargar la información del cliente o del trabajo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white rounded-lg p-100">
        <div className="p-5">
          <Breadcrumb />
          <h1 className="text-2xl font-semibold mb-4 text-center md:text-left">Lista de Materiales</h1>

          <MaterialSearch handleAddMaterialWithQuantity={handleAddMaterialWithQuantity} />


          {selectedMaterials.length > 0 && (
            <>
              <SelectedMaterialsTable
                selectedMaterials={selectedMaterials}
                handleRemoveMaterial={handleRemoveMaterial}
                handleUpdateQuantity={handleUpdateQuantity}
              />
              <MaterialSummary selectedMaterials={selectedMaterials} />
            </>
          )}
          <div className="flex justify-center md:justify-end mt-5">
            <button
              className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-opacity-50"
              onClick={saveMaterialList}
              disabled={selectedMaterials.length === 0}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pmaterial;
