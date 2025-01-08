import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AccesoPago from './components/ListaTrabajador';
import Breadcrumb from '../../../../general/Breadcrumb';
import SummaryFlujo from './components/SummaryFlujo';
import { FaSave, FaPlus } from 'react-icons/fa';

const FlujoCaja = () => {
  const { projectId } = useParams();
  const [client, setClient] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const listaTrabajadorRef = useRef();
  const [total, setTotal] = useState(0);
  const [totalRegistered, setTotalRegistered] = useState(0);

  const [newTotal, setNewTotal] = useState(0);
  const [registeredTotal, setRegisteredTotal] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const jobResponse = await axios.get(`http://localhost:5000/api/projects`);
        const projectData = jobResponse.data.find(project => project.project_id === parseInt(projectId));
        if (!projectData) {
          throw new Error('No se encontró el proyecto');
        }
        setJob(projectData);

        const clientResponse = await axios.get(`http://localhost:5000/api/clients`);
        const clientData = clientResponse.data.find(client => client.client_id === projectData.client_id);
        setClient(clientData);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);
  const handleUpdateTotal = (newPaymentsTotal, registeredPaymentsTotal) => {
    console.log('Nuevos pagos:', newPaymentsTotal);
    console.log('Pagos registrados:', registeredPaymentsTotal);
    setNewTotal(newPaymentsTotal);
    setRegisteredTotal(registeredPaymentsTotal);
  };
  const handleAddRow = () => {
    if (listaTrabajadorRef.current) {
      listaTrabajadorRef.current.handleAddRow();
    }
  };

  const handleSubmitPayments = async () => {
    if (listaTrabajadorRef.current) {
      await listaTrabajadorRef.current.handleSubmitPayments();
    }
  };

  const formatCLP = (value) => {
    if (value == null || isNaN(value)) return '\$0';
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

  return (
    <div className="flex flex-col p-5 h-full">
      <div className="h-full rounded-xl">
        <Breadcrumb />
        <div className="p-4 bg-white shadow-md rounded-tl-lg rounded-tr-lg border-l-4 border-red-800">
          <p className="text-gray-900 font-semibold text-lg">Cliente:</p>
          <p className="text-gray-800 text-base">{client?.name}</p>

          <div className="mt-4">
            <p className="text-gray-900 font-semibold text-lg">Proyecto:</p>
            <p className="text-gray-800 text-base">{job?.project_name}</p>
          </div>
        </div>
        <div className="p-4 bg-white rounded-b-lg border-l-4 border-red-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Flujo de Caja</h2>
          <div className="mt- text-end flex space-x-4">
            <button
              onClick={handleAddRow}
              className="flex items-center space-x-2 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
            >
  <FaPlus className="text-lg" />            </button>
            <button
              onClick={handleSubmitPayments}
              className="flex items-center space-x-2 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
            >
  <FaSave className="text-lg" />            </button>
            </div>
          </div>

          <AccesoPago
            ref={listaTrabajadorRef}
            projectId={projectId}
            quoteNumber={job?.quote_number}
            onUpdateTotal={handleUpdateTotal}
          />

          <SummaryFlujo
            newTotal={newTotal}
            registeredTotal={registeredTotal}
            formatCLP={formatCLP}
          />
          <div className="mt-4 space-x-2">
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlujoCaja;