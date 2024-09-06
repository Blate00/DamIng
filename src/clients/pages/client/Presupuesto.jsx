import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClientInfo from './components/ClientInfo';
import ItemsTable from './components/ItemsTable';
import Summary from './components/Summary';
import Breadcrumb from '../../../general/Breadcrumb'; 

const Presupuesto = () => {
  const { id, jobIndex } = useParams(); // Obtener id del cliente y jobIndex
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients[parseInt(id)]; // Buscar cliente por id

  if (!client) {
    return <div>Cliente no encontrado</div>;
  }

  const job = client?.jobs[parseInt(jobIndex)]; // Buscar trabajo por jobIndex
  if (!job) {
    return <div>Trabajo no encontrado</div>;
  }

  const [items, setItems] = useState([{ description: '', quantity: 0, unitValue: 0, total: 0 }]);
  const [ggPercentage, setGgPercentage] = useState(20);
  const [gestionPercentage, setGestionPercentage] = useState(8);
  const [trabajadores, setTrabajadores] = useState([]);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('items')) || [];
    const savedGgPercentage = parseFloat(localStorage.getItem('ggPercentage')) || 20;
    const savedGestionPercentage = parseFloat(localStorage.getItem('gestionPercentage')) || 8;
    const savedTrabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];

    setItems(savedItems);
    setGgPercentage(savedGgPercentage);
    setGestionPercentage(savedGestionPercentage);
    setTrabajadores(savedTrabajadores);
  }, []);

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === 'quantity' || field === 'unitValue') {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const unitValue = parseFloat(updatedItems[index].unitValue) || 0;
      updatedItems[index].total = (quantity * unitValue).toFixed(2);
    }

    setItems(updatedItems);

    if (
      updatedItems[index].description &&
      updatedItems[index].quantity &&
      updatedItems[index].unitValue &&
      index === updatedItems.length - 1
    ) {
      setItems([...updatedItems, { description: '', quantity: 0, unitValue: 0, total: 0 }]);
    }

    // Guardar items en localStorage
    localStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const formatCLP = (value) => {
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  };

  const total = items.reduce((total, item) => total + parseFloat(item.total || 0), 0);
  const ggValue = (total * ggPercentage) / 100;
  const gestionValue = (total * gestionPercentage) / 100;
  const subtotal = total + ggValue + gestionValue;

  const saveToLocalStorage = () => {
    const dataToSave = {
      total,
      gg: ggValue,
      gestion: gestionValue,
      subtotal,
      ggPercentage, // Guardar el porcentaje GG
      gestionPercentage // Guardar el porcentaje Gestión
    };
    localStorage.setItem('presupuestoData', JSON.stringify(dataToSave));
    localStorage.setItem('ggPercentage', ggPercentage);
    localStorage.setItem('gestionPercentage', gestionPercentage);
    alert('Datos guardados en el localStorage');
  };

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg">
        <div className="p-5">
          <Breadcrumb />          
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Presupuesto</h2>
          <p>ID del Proyecto: {jobIndex}</p> {/* Muestra la ID del proyecto */}
          <ClientInfo client={client} job={job} />

          <ItemsTable
            items={items}
            handleChange={handleChange}
            formatCLP={formatCLP}
            deleteItem={deleteItem}
          />

          <Summary
            total={total}
            ggPercentage={ggPercentage}
            gestionPercentage={gestionPercentage}
            ggValue={ggValue}
            gestionValue={gestionValue}
            subtotal={subtotal}
            formatCLP={formatCLP}
          />

          <button 
            className="mt-4 bg-red-800 text-white p-2 rounded"
            onClick={saveToLocalStorage}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Presupuesto;
