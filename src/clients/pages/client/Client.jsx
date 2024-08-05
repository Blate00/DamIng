import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../../general/Sidebar';
import Header from '../../../general/Header';

const Client = () => {
  const { id } = useParams();
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients[id];
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [materials, setMaterials] = useState(client ? client.materials : []);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    if (client) {
      updateTotalValue(materials);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const addMaterial = (description, value, quantity) => {
    const newMaterial = { description, value, quantity };
    const updatedMaterials = [...materials, newMaterial];
    setMaterials(updatedMaterials);
    updateClientMaterials(updatedMaterials);
    updateTotalValue(updatedMaterials);
  };

  const updateMaterialQuantity = (index, quantityChange) => {
    const updatedMaterials = materials.map((material, i) => {
      if (i === index) {
        const updatedQuantity = material.quantity + quantityChange;
        return { ...material, quantity: updatedQuantity >= 0 ? updatedQuantity : 0 };
      }
      return material;
    });
    setMaterials(updatedMaterials);
    updateClientMaterials(updatedMaterials);
    updateTotalValue(updatedMaterials);
  };

  const deleteMaterial = (index) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    setMaterials(updatedMaterials);
    updateClientMaterials(updatedMaterials);
    updateTotalValue(updatedMaterials);
  };

  const updateClientMaterials = (updatedMaterials) => {
    const updatedClients = clients.map((c, i) => {
      if (i === parseInt(id)) {
        return { ...c, materials: updatedMaterials };
      }
      return c;
    });
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const updateTotalValue = (materials) => {
    const total = materials.reduce((acc, material) => acc + (material.value * material.quantity), 0);
    setTotalValue(total);
  };

  if (!client) {
    return <div>Cliente no encontrado</div>;
  }

  return (
    <div className="flex h-screen">
      {isSidebarVisible && <Sidebar className="w-1/4" />}
      <div className={`flex-1 ${isSidebarVisible ? '' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="p-6">
          <div className="bg-gray-100 p-6 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">{client.name}</h2>
            <div className="bg-white p-4 rounded-md shadow-md">
              <p className="text-sm text-gray-600">Correo Electrónico: {client.email}</p>
              <p className="text-sm text-gray-600">Dirección: {client.address}</p>
              <p className="text-sm text-gray-600">Teléfono: {client.phone}</p>
              <p className="text-sm text-gray-600">Tipo de Trabajo: {client.jobType}</p>
              <h4 className="font-semibold mt-4">Materiales</h4>
              <MaterialList materials={materials} onUpdateQuantity={updateMaterialQuantity} onDelete={deleteMaterial} />
              <AddMaterialForm onAdd={addMaterial} />
              <h4 className="font-semibold mt-4">Valor Total de Materiales: {totalValue}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MaterialList = ({ materials, onUpdateQuantity, onDelete }) => (
  <ul className="divide-y divide-gray-200">
    {materials.map((material, index) => (
      <li key={index} className="flex justify-between items-center py-2">
        <div className="flex flex-col text-sm text-gray-600">
          <span>{material.description}</span>
          <span>Valor Unitario: {material.value}</span>
          <span>Cantidad: {material.quantity}</span>
          <span>Valor Total: {material.value * material.quantity}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="bg-green-500 text-white px-2 py-1 rounded"
            onClick={() => onUpdateQuantity(index, 1)}
          >
            +1
          </button>
          <button
            className="bg-yellow-500 text-white px-2 py-1 rounded"
            onClick={() => onUpdateQuantity(index, -1)}
            disabled={material.quantity <= 0}
          >
            -1
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => onDelete(index)}
          >
            Eliminar
          </button>
        </div>
      </li>
    ))}
  </ul>
);

const AddMaterialForm = ({ onAdd }) => {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description && value && quantity >= 0) {
      onAdd(description, value, quantity);
      setDescription('');
      setValue('');
      setQuantity(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
     
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Añadir
      </button>
    </form>
  );
};

export default Client;
