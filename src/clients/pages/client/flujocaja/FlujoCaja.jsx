import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AccesoPago from './components/ListaTrabajador';
import Breadcrumb from '../../../../general/Breadcrumb';
import SummaryFlujo from './components/SummaryFlujo';

const FlujoCaja = () => {
  const { id, projectId } = useParams();
  const [client, setClient] = useState(null);
  const [job, setJob] = useState(null);
  const [trabajadores, setTrabajadores] = useState(JSON.parse(localStorage.getItem('trabajadores')) || []);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchClientAndJob = () => {
      // Replace Supabase calls with localStorage or hardcoded data if necessary.
      const storedClients = JSON.parse(localStorage.getItem('clients')) || [];
      const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
      
      const clientData = storedClients.find(client => client.client_id === id);
      const jobData = storedProjects.find(project => project.project_id === projectId);

      setClient(clientData || { name: "Cliente Demo" });
      setJob(jobData || { project_name: "Proyecto Demo" });

      // Calculate total from trabajadores
      const calculatedTotal = trabajadores.reduce((acc, trabajador) => acc + (trabajador.total || 0), 0);
      setTotal(calculatedTotal);
    };

    fetchClientAndJob();
  }, [id, projectId, trabajadores]);

  const handleDeleteTrabajador = (index) => {
    const updatedTrabajadores = trabajadores.filter((_, i) => i !== index);
    setTrabajadores(updatedTrabajadores);
    localStorage.setItem('trabajadores', JSON.stringify(updatedTrabajadores));

    // Recalculate total after deletion
    const newTotal = updatedTrabajadores.reduce((acc, trabajador) => acc + (trabajador.total || 0), 0);
    setTotal(newTotal);
  };

  const formatCLP = (value) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="flex items-start">
        <div className="p-5 w-full">
          <Breadcrumb />
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Flujo de Caja</h2>

          <div className="mb-4">
            <p>Cliente: {client?.name}</p>
            <p>Trabajo: {job?.project_name}</p>
          </div>

          <AccesoPago
            trabajadores={trabajadores}
            onDeleteTrabajador={handleDeleteTrabajador}
          />

          <SummaryFlujo 
            total={total} 
            formatCLP={formatCLP} 
            projectId={projectId} 
          />
        </div>
      </div>
    </div>
  );
};

export default FlujoCaja;
