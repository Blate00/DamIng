import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import ClientInfo from './components/ClientInfo';
import ItemsTable from './components/ItemsTable';
import Summary from './components/Summary';
import TablaRendicion from './components/TablaRendicion';
import ExportButtons from './components/ExportButtons';
import Asignacion from './components/Asignacion';
import ManoObra from './components/ManoObra';
import AccesoPago from './components/ListaTrabajador'; // Importa el componente TrabajadoresList
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

const Presupuesto = () => {
  const { id, jobId } = useParams();
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients[id];
  const [abonosManoObra, setAbonosManoObra] = useState(JSON.parse(localStorage.getItem('abonosManoObra')) || []);
  const [items, setItems] = useState([{ description: '', quantity: '', unitValue: '', total: '' }]);
  const [ggPercentage, setGgPercentage] = useState(20);
  const [gestionPercentage, setGestionPercentage] = useState(8);
  const [asignacion, setAsignacion] = useState(0);
  const [abonosAsignacion, setAbonosAsignacion] = useState([]);
  const [nuevoAbonoAsignacion, setNuevoAbonoAsignacion] = useState(0);
  const [manoObra, setManoObra] = useState(0);
  const [activeSection, setActiveSection] = useState(null); // Estado para manejar la sección activa

  // Estado para los trabajadores
  const [trabajadores, setTrabajadores] = useState([]);
  const totalRecibido = abonosManoObra.reduce((total, abono) => total + abono.monto, 0);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('items'));
    const savedGgPercentage = localStorage.getItem('ggPercentage');
    const savedGestionPercentage = localStorage.getItem('gestionPercentage');
    const storedAsignacion = localStorage.getItem('asignacion');
    const storedManoObra = localStorage.getItem('manoObra');
    const savedTrabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];

    if (savedItems) setItems(savedItems);
    if (savedGgPercentage) setGgPercentage(parseFloat(savedGgPercentage));
    if (savedGestionPercentage) setGestionPercentage(parseFloat(savedGestionPercentage));
    if (storedAsignacion) setAsignacion(parseFloat(storedAsignacion) || 0);
    if (storedManoObra) setManoObra(parseFloat(storedManoObra) || 0);
    if (savedTrabajadores) setTrabajadores(savedTrabajadores);
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

  const handleDeleteTrabajador = (index) => {
    const updatedTrabajadores = trabajadores.filter((_, i) => i !== index);
    setTrabajadores(updatedTrabajadores);
    localStorage.setItem('trabajadores', JSON.stringify(updatedTrabajadores));
  };

  const handleGuardarDatos = () => {
    localStorage.setItem('items', JSON.stringify(items));
    localStorage.setItem('ggPercentage', ggPercentage);
    localStorage.setItem('gestionPercentage', gestionPercentage);
    localStorage.setItem('netTotal', netTotal);
    localStorage.setItem('trabajadores', JSON.stringify(trabajadores));
    alert('Datos guardados con éxito');
  };

  const exportToPDF = () => {
    // Implementación exportToPDF
  };

  const exportToExcel = () => {
    // Implementación exportToExcel
  };

  if (!client) return <div>Cliente no encontrado</div>;

  const job = client.jobs.find(job => job.id === jobId);
  if (!job) return <div>Trabajo no encontrado</div>;

  const totalRecibidoAsignacion = abonosAsignacion.reduce((total, abono) => total + abono.monto, 0);
  const totalRendicion = items.reduce((total, item) => total + (parseFloat(item.total) || 0), 0);
  const saldoActualAsignacion = totalRecibidoAsignacion;
  const saldoFinalAsignacion = totalRecibidoAsignacion - totalRendicion;

  const calculateNetTotal = () => items.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);

  const netTotal = calculateNetTotal();
  const gg = ((netTotal * ggPercentage) / 100).toFixed(2);
  const gestion = ((netTotal * gestionPercentage) / 100).toFixed(2);
  const totalGgGestion = (parseFloat(gg) + parseFloat(gestion)).toFixed(2);
  const totalNet = (parseFloat(netTotal) + parseFloat(totalGgGestion)).toFixed(2);
  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
  };

  const formatCLP = (value) => {
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  };

  // Manejar el despliegue de las secciones
  const handleSectionToggle = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div id="presupuesto-content" className="w-full rounded-lg p-5 ">
        <ClientInfo client={client} job={job} />

       
          <ItemsTable items={items} handleChange={handleChange} formatCLP={formatCLP} />
          <Summary
            netTotal={netTotal}
            ggPercentage={ggPercentage}
            gestionPercentage={gestionPercentage}
            gg={gg}
            gestion={gestion}
            totalGgGestion={totalGgGestion}
            totalNet={totalNet}
            setGgPercentage={setGgPercentage}
            setGestionPercentage={setGestionPercentage}
            formatCLP={formatCLP}
          />
          <button
            onClick={handleGuardarDatos}
            className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Guardar datos
          </button>

     
      
      </div>
    </div>
  );
};

const Section = ({ title, isVisible, onToggle, children }) => (
  <div className="mt-8">
    <div
      className="flex items-center justify-between cursor-pointer p-3 bg-red-800 rounded-md shadow-md"
      onClick={onToggle}
    >
      <h4 className="text-center text-xl font-bold text-white">{title}</h4>
      {isVisible ? (
        <ChevronUpIcon className="w-6 h-6 text-white" />
      ) : (
        <ChevronDownIcon className="w-6 h-6 text-white" />
      )}
    </div>
    {isVisible && <div className="mt-4">{children}</div>}
  </div>
);

export default Presupuesto;
