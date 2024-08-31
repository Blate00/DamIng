import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMaterials } from '../../../general/MaterialsContext';
import Breadcrumb from '../../../general/Breadcrumb'; 
import ClientInfo from './components/ClientInfo';
import GroupFilter from './components/GroupFilter';
import MaterialTable from './components/MaterialTable';
import DiscardedMaterialsTable from './components/DiscardedMaterialsTable';
import SelectedMaterialsTable from './components/SelectedMaterialsTable';
import MaterialSearch from './components/MaterialSearch';

const Pmaterial = () => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [discardedMaterials, setDiscardedMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [materials, setMaterials] = useMaterials();
  const { id, jobId } = useParams();
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients[id];
  const groups = [...new Set(materials.map(material => material.group))];

  const toggleGroupSelection = (group) => {
    setSelectedGroups((prevSelectedGroups) =>
      prevSelectedGroups.includes(group)
        ? prevSelectedGroups.filter((g) => g !== group)
        : [...prevSelectedGroups, group]
    );
  };

  const handleAddMaterial = (index) => {
    const materialToAdd = materials[index];
    setSelectedMaterials([...selectedMaterials, { ...materialToAdd, quantity: 1 }]);
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleAddMaterialWithQuantity = (material, quantity) => {
    setSelectedMaterials([...selectedMaterials, { ...material, quantity }]);
    setMaterials(materials.filter((mat) => mat !== material));
  };

  const handleRemoveMaterial = (index) => {
    const materialToRemove = selectedMaterials[index];
    setMaterials([...materials, materialToRemove]);
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
    const materialToDiscard = materials[index];
    setDiscardedMaterials([...discardedMaterials, materialToDiscard]);
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleRecoverMaterial = (index) => {
    const materialToRecover = discardedMaterials[index];
    setMaterials([...materials, materialToRecover]);
    setDiscardedMaterials(discardedMaterials.filter((_, i) => i !== index));
  };

  const filteredMaterials = selectedGroups.length > 0 
    ? materials.filter(material => selectedGroups.includes(material.group))
    : [];
    
  const job = client?.jobs.find(job => job.id === jobId);
  if (!job) return <div>Trabajo no encontrado</div>;

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white rounded-lg p-100">
        <div className="p-5">
          <Breadcrumb/>
       
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Lista de Materiales</h1>
          <MaterialSearch materials={materials} handleAddMaterialWithQuantity={handleAddMaterialWithQuantity} />
            <ClientInfo client={client} job={job} />
          {selectedMaterials.length > 0 && (
            <SelectedMaterialsTable
              selectedMaterials={selectedMaterials}
              handleRemoveMaterial={handleRemoveMaterial}
              handleUpdateQuantity={handleUpdateQuantity}
            />
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
