import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AccesoPago from './components/ListaTrabajador';
import Breadcrumb from '../../../general/Breadcrumb';
import { supabase } from '../../../supabase/client'; // Asegúrate de importar supabase

const FlujoCaja = () => {
  const { id, projectId } = useParams(); // Obtener id del cliente y projectId desde la URL
  const [client, setClient] = useState(null);
  const [job, setJob] = useState(null);
  const [abonosManoObra, setAbonosManoObra] = useState(JSON.parse(localStorage.getItem('abonosManoObra')) || []);
  const [trabajadores, setTrabajadores] = useState([]);

  useEffect(() => {
    const fetchClientAndJob = async () => {
      try {
        // Obtenemos los datos del cliente
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('client_id', id)
          .single();

        if (clientError) {
          throw clientError;
        }

        setClient(clientData);

        // Obtenemos el trabajo (proyecto) asociado al cliente
        const { data: jobData, error: jobError } = await supabase
          .from('projects')
          .select('*')
          .eq('project_id', projectId)
          .single();

        if (jobError) {
          throw jobError;
        }

        setJob(jobData);
      } catch (error) {
        console.error('Error fetching client or job:', error.message);
      }
    };

    fetchClientAndJob();
  }, [id, projectId]);

  useEffect(() => {
    const savedTrabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];
    if (savedTrabajadores) setTrabajadores(savedTrabajadores);
  }, []);

  const totalRecibido = abonosManoObra.reduce((total, abono) => total + abono.monto, 0);

  const handleDeleteTrabajador = (index) => {
    const updatedTrabajadores = trabajadores.filter((_, i) => i !== index);
    setTrabajadores(updatedTrabajadores);
    localStorage.setItem('trabajadores', JSON.stringify(updatedTrabajadores));
  };

  return (
    <div className="flex flex-col p-3 bg-white h-full">
      <div className="flex items-start">
        <div className="p-5">
          <Breadcrumb />
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Flujo de Caja</h2>

          {client && job ? (
            <div>
              <p>Cliente: {client.name}</p>
              <p>Trabajo: {job?.project_name}</p>
            </div>
          ) : (
            <p>Cargando datos del cliente y trabajo...</p>
          )}

          <table className="min-w-full rounded-lg shadow-lg">
            <thead className="bg-red-800 rounded-lg">
              <tr className="border border-white">
                <th className="text-center py-1 px-1 text-white border-r border-white font-bold">Cliente</th>
                <th className="text-center py-1 px-1 text-white border-r border-white font-bold">Trabajo</th>
                <th className="text-center py-1 px-1 text-white border-r border-white font-bold">
                  Dinero Disponible: {totalRecibido.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </th>
              </tr>
            </thead>
          </table>

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