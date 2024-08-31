import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMaterials } from '../../../general/MaterialsContext';
import Breadcrumb from '../../../general/Breadcrumb';
import ClientInfo from './components/ClientInfo';
import SelectedMaterialsTable from './components/SelectedMaterialsTable';
import MaterialSearch from './components/MaterialSearch';
import DiscardedMaterialsTable from './components/DiscardedMaterialsTable';
import MaterialSummary from './components/MaterialSummary';  // Importar el nuevo componente

const Pmaterial = () => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [discardedMaterials, setDiscardedMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [materials, setMaterials] = useMaterials();
  const { id, jobId } = useParams();
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients[id];

  // Estados para los porcentajes de GG y Gestión
  const [ggPercentage, setGgPercentage] = useState(0);
  const [gestionPercentage, setGestionPercentage] = useState(0);
  
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
    const materialToDiscard = selectedMaterials[index];
    setDiscardedMaterials([...discardedMaterials, materialToDiscard]);
    setSelectedMaterials(selectedMaterials.filter((_, i) => i !== index));
  };

  const handleRecoverMaterial = (index) => {
    const materialToRecover = discardedMaterials[index];
    setMaterials([...materials, materialToRecover]);
    setDiscardedMaterials(discardedMaterials.filter((_, i) => i !== index));
  };

  const job = client?.jobs.find(job => job.id === jobId);
  if (!job) return <div>Trabajo no encontrado</div>;

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white rounded-lg p-100">
        <div className="p-5">
          <Breadcrumb />
          <h1 className="text-2xl font-semibold mb-4 text-center md:text-left">Lista de Materiales</h1>
          
          {/* Componente para buscar y agregar materiales */}
          <MaterialSearch materials={materials} handleAddMaterialWithQuantity={handleAddMaterialWithQuantity} />
          
          {/* Información del cliente y trabajo */}
          <ClientInfo client={client} job={job} />
          
          {/* Tabla de materiales seleccionados */}
          {selectedMaterials.length > 0 && (
            <SelectedMaterialsTable
              selectedMaterials={selectedMaterials}
              handleRemoveMaterial={handleRemoveMaterial}
              handleUpdateQuantity={handleUpdateQuantity}
            />
          )}

          {/* Tabla de materiales descartados */}
          {discardedMaterials.length > 0 && (
            <DiscardedMaterialsTable
              discardedMaterials={discardedMaterials}
              handleRecoverMaterial={handleRecoverMaterial}
            />
          )}

          {/* Resumen de materiales seleccionados */}
         
        </div>
      </div> {selectedMaterials.length > 0 && (
            <MaterialSummary
              selectedMaterials={selectedMaterials}
              ggPercentage={ggPercentage}
              setGgPercentage={setGgPercentage}
              gestionPercentage={gestionPercentage}
              setGestionPercentage={setGestionPercentage}
            />
          )}
    </div>
  );
};

export default Pmaterial;
