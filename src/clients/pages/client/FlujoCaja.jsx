import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AccesoPago from './components/ListaTrabajador';
import Breadcrumb from '../../../general/Breadcrumb';
import { supabase } from '../../../supabase/client';

const FlujoCaja = () => {
  const { id, projectId } = useParams();
  const [client, setClient] = useState(null);
  const [job, setJob] = useState(null);
  const [abonosManoObra, setAbonosManoObra] = useState(JSON.parse(localStorage.getItem('abonosManoObra')) || []);
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (!client) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Cliente no encontrado</h2>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Trabajo no encontrado</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="flex items-start">
        <div className="p-5">
          <Breadcrumb />
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Flujo de Caja</h2>

          <div>
            <p>Cliente: {client.name}</p>
            <p>Trabajo: {job.project_name}</p>
          </div>

          <AccesoPago
            trabajadores={trabajadores}
            onDeleteTrabajador={handleDeleteTrabajador}
          />
          {/* Otros elementos del flujo de caja pueden ir aquí */}
        </div>
      </div>
    </div>
  );
};

export default FlujoCaja;