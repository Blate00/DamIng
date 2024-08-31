import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClientInfo from './components/ClientInfo';
import ItemsTable from './components/ItemsTable';
import Summary from './components/Summary';
import Breadcrumb from '../../../general/Breadcrumb'; 

const Presupuesto = () => {
  const { id, jobId } = useParams();
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients[id];

  const [items, setItems] = useState([{ description: '', quantity: '', unitValue: '', total: '' }]);
  const [ggPercentage, setGgPercentage] = useState(20);
  const [gestionPercentage, setGestionPercentage] = useState(8);
  const [trabajadores, setTrabajadores] = useState([]);
  const [abonosManoObra, setAbonosManoObra] = useState(JSON.parse(localStorage.getItem('abonosManoObra')) || []);
  const [asignacion, setAsignacion] = useState(0);
  const [manoObra, setManoObra] = useState(0);
  const [abonosAsignacion, setAbonosAsignacion] = useState([]);
  const [nuevoAbonoAsignacion, setNuevoAbonoAsignacion] = useState(0);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('items')) || [];
    const savedGgPercentage = localStorage.getItem('ggPercentage') || '20';
    const savedGestionPercentage = localStorage.getItem('gestionPercentage') || '8';
    const savedTrabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];

    setItems(savedItems);
    setGgPercentage(parseFloat(savedGgPercentage));
    setGestionPercentage(parseFloat(savedGestionPercentage));
    setTrabajadores(savedTrabajadores);
  }, []);

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === 'quantity' || field === 'unitValue') {
      updatedItems[index].total = (updatedItems[index].quantity * updatedItems[index].unitValue).toFixed(2);
    }

    setItems(updatedItems);

    if (
      updatedItems[index].description &&
      updatedItems[index].quantity &&
      updatedItems[index].unitValue &&
      index === updatedItems.length - 1
    ) {
      setItems([...updatedItems, { description: '', quantity: '', unitValue: '', total: '' }]);
    }
  };

  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const formatCLP = (value) => {
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  };

  const job = client?.jobs.find(job => job.id === jobId);
  if (!job) return <div>Trabajo no encontrado</div>;

  const total = items.reduce((total, item) => total + parseFloat(item.total || 0), 0);
  const ggValue = (total * ggPercentage) / 100;
  const gestionValue = (total * gestionPercentage) / 100;
  const subtotal = total + ggValue + gestionValue;

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="bg-white h-full rounded-lg">
        <div className="p-5">
          <Breadcrumb />          <h2 className="text-xl font-semibold mb-4 text-gray-800">Presupuesto</h2>

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
        </div>
      </div>
    </div>
  );
};

export default Presupuesto;
