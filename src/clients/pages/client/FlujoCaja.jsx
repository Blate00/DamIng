import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AccesoPago from './components/ListaTrabajador';
import Breadcrumb from '../../../general/Breadcrumb';
import { supabase } from '../../../supabase/client';
import SummaryFlujo from './components/SummaryFlujo'; // Import the SummaryFlujo component

const FlujoCaja = () => {
  const { id, projectId } = useParams();
  const [client, setClient] = useState(null);
  const [job, setJob] = useState(null);
  const [abonosManoObra, setAbonosManoObra] = useState(JSON.parse(localStorage.getItem('abonosManoObra')) || []);
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0); // Add state for total

  useEffect(() => {
    const fetchClientAndJob = async () => {
      try {
        setLoading(true);
        const [clientData, jobData] = await Promise.all([
          supabase.from('clients').select('*').eq('client_id', id).single(),
          supabase.from('projects').select('*').eq('project_id', projectId).single()
        ]);

        if (clientData.error) throw clientData.error;
        if (jobData.error) throw jobData.error;

        setClient(clientData.data);
        setJob(jobData.data);

        const savedTrabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];
        setTrabajadores(savedTrabajadores);

        // Calculate total from trabajadores
        const calculatedTotal = savedTrabajadores.reduce((acc, trabajador) => acc + (trabajador.total || 0), 0);
        setTotal(calculatedTotal);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientAndJob();
  }, [id, projectId]);

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
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            {!client ? 'Cliente no encontrado' : 'Trabajo no encontrado'}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="flex items-start">
        <div className="p-5 w-full">
          <Breadcrumb />
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Flujo de Caja</h2>

          <div className="mb-4">
            <p>Cliente: {client.name}</p>
            <p>Trabajo: {job.project_name}</p>
          </div>

          <AccesoPago
            trabajadores={trabajadores}
            onDeleteTrabajador={handleDeleteTrabajador}
          />
          
          {/* Add SummaryFlujo component */}
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