import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../supabase/client';
import Breadcrumb from '../../../general/Breadcrumb';
import ClientInfo from './components/ClientInfo';
import SelectedMaterialsTable from './components/SelectedMaterialsTable';
import MaterialSearch from './components/MaterialSearch';
import DiscardedMaterialsTable from './components/DiscardedMaterialsTable';
import MaterialSummary from './components/MaterialSummary';

const Pmaterial = () => {
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [discardedMaterials, setDiscardedMaterials] = useState([]);
  const { id, projectId } = useParams();
  const [client, setClient] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClientAndJob();
  }, [id, projectId]);

  const fetchClientAndJob = async () => {
    try {
      setLoading(true);
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('client_id', id)
        .single();

      if (clientError) throw clientError;
      setClient(clientData);

      const { data: jobData, error: jobError } = await supabase
        .from('projects')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterialWithQuantity = (material, quantity) => {
    setSelectedMaterials([...selectedMaterials, { ...material, quantity }]);
  };

  const handleRemoveMaterial = (index) => {
    setSelectedMaterials(selectedMaterials.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index, delta) => {
    setSelectedMaterials((prevSelectedMaterials) =>
      prevSelectedMaterials.map((material, i) =>
        i === index ? { ...material, quantity: material.quantity + delta } : material
      )
    );
  };

  const handleDiscardMaterial = (index) => {
    const materialToDiscard = selectedMaterials[index];
    setDiscardedMaterials([...discardedMaterials, materialToDiscard]);
    setSelectedMaterials(selectedMaterials.filter((_, i) => i !== index));
  };

  const handleRecoverMaterial = (index) => {
    const materialToRecover = discardedMaterials[index];
    setSelectedMaterials([...selectedMaterials, materialToRecover]);
    setDiscardedMaterials(discardedMaterials.filter((_, i) => i !== index));
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
          
          <ClientInfo client={client} job={job} />
          
          {selectedMaterials.length > 0 && (
            <SelectedMaterialsTable
              selectedMaterials={selectedMaterials}
              handleRemoveMaterial={handleRemoveMaterial}
              handleUpdateQuantity={handleUpdateQuantity}
            />
          )}
          {selectedMaterials.length > 0 && (
            <MaterialSummary selectedMaterials={selectedMaterials} />
          )}
          {discardedMaterials.length > 0 && (
            <DiscardedMaterialsTable
              discardedMaterials={discardedMaterials}
              handleRecoverMaterial={handleRecoverMaterial}
            />
          )}
        </div>
      </div> 
    </div>
  );
};

export default Pmaterial;