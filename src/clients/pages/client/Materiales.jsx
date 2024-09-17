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

  useEffect(() => {
    fetchClientAndJob();
  }, [id, projectId]);

  const fetchClientAndJob = async () => {
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('client_id', id)
      .single();

    if (clientError) {
      console.error('Error fetching client:', clientError);
    } else {
      setClient(clientData);
    }

    const { data: jobData, error: jobError } = await supabase
      .from('projects')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (jobError) {
      console.error('Error fetching job:', jobError);
    } else {
      setJob(jobData);
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

  if (!client || !job) return <div>Cargando...</div>;

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