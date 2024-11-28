import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Asignacion from './components/Asignacion';
import ManoObra from './components/ManoObra';
import Breadcrumb from '../../../../general/Breadcrumb';
import TablaRendicion from './components/TablaRendicion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import damLogo from '../../../../assets/damLogo.png';
import { FaSave, FaPlus } from 'react-icons/fa';
import Dpdf from './Dpdf';

const Rendicion = () => {
  const { id, projectId } = useParams();
  const [client, setClient] = useState(null);
  const [job, setJob] = useState(null);
  const [items, setItems] = useState([]);
  const [asignacion, setAsignacion] = useState({ saldo_recibido: 0, saldo_actual: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [asignacionesData, setAsignacionesData] = useState([]);
  const [manoObraData, setManoObraData] = useState({
    total_mano_obra: 0,
    total_recibido: 0
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [jobResponse, rendicionesResponse, proveedoresResponse, clientResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/projects`),
        axios.get(`http://localhost:5000/api/rendiciones/project/${projectId}`),
        axios.get(`http://localhost:5000/api/proveedores`),
        axios.get(`http://localhost:5000/api/clients`)
      ]);

      const projectData = jobResponse.data.find(project => project.project_id === parseInt(projectId));
      if (!projectData) throw new Error('No se encontró el proyecto');

      const clientData = clientResponse.data.find(client => client.client_id === parseInt(id));
      if (!clientData) throw new Error('No se encontró el cliente');

      setJob(projectData);
      setItems(rendicionesResponse.data);
      setProveedores(proveedoresResponse.data);
      setClient(clientData);

      if (projectData.quote_number) {
        const [asignacionesResponse, manoObraResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/asignacion/${projectData.quote_number}`),
          axios.get(`http://localhost:5000/api/mano-obra/${projectData.quote_number}`)
        ]);

        setAsignacionesData(asignacionesResponse.data || []);

        // En el fetchData del componente Rendicion
        if (manoObraResponse.data.length > 0) {
          const manoObraInfo = manoObraResponse.data[0];
          setManoObraData({
            total_mano_obra: manoObraInfo.total_mano_obra || 0,
            total_recibido: manoObraInfo.total_recibido || 0,
            saldo_actual: manoObraInfo.saldo_actual || 0,
            abonos: manoObraResponse.data.map(item => ({
              saldo_recibido: item.saldo_recibido,
              medio_pago: item.medio_pago,
              fecha_actualizacion: item.fecha_actualizacion
            }))
          });
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [id, projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteItem = async (index) => {
    try {
      const itemToDelete = items[index];
      if (itemToDelete.rendicion_id) {
        await axios.delete(`http://localhost:5000/api/rendiciones/${itemToDelete.rendicion_id}`);
        setItems(prevItems => prevItems.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error al eliminar el item');
    }
  };

  const agregarFila = useCallback(() => {
    if (!job) return;

    const newItem = {
      project_id: projectId,
      quote_number: job.quote_number || '',
      fecha: new Date().toISOString().split('T')[0],
      detalle: '',
      folio: '',
      proveedor_id: '',
      documento: '',
      total: 0
    };

    setItems(prevItems => [...prevItems, newItem]);
  }, [projectId, job]);

  const handleChange = async (index, field, value) => {
    try {
      const updatedItems = [...items];
      const item = updatedItems[index];

      if (field === 'fecha') {
        item[field] = value.split('T')[0];
      } else if (field === 'total') {
        item[field] = parseFloat(value) || 0;
      } else {
        item[field] = value;
      }

      setItems(updatedItems);

      if (item.rendicion_id) {
        await axios.put(`http://localhost:5000/api/rendiciones/${item.rendicion_id}`, item);
      }
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error al actualizar el item');
    }
  };

  const handleProveedorChange = async (index, proveedorId) => {
    try {
      const updatedItems = [...items];
      updatedItems[index].proveedor_id = proveedorId;
      setItems(updatedItems);

      if (updatedItems[index].rendicion_id) {
        await axios.put(`http://localhost:5000/api/rendiciones/${updatedItems[index].rendicion_id}`, {
          ...updatedItems[index],
          proveedor_id: proveedorId
        });
      }
    } catch (error) {
      console.error('Error updating proveedor:', error);
      alert('Error al actualizar el proveedor');
    }
  };

  const formatCLP = useCallback((value) => {
    if (value == null || isNaN(value)) return '\$0';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(value);
  }, []);

  const totalRendicion = items.reduce((total, item) => total + (parseFloat(item.total) || 0), 0);

  const guardarRendiciones = async () => {
    try {
      const itemsToSave = items.filter(item =>
        item.project_id &&
        item.quote_number &&
        item.total &&
        item.proveedor_id
      );

      if (itemsToSave.length !== items.length) {
        alert('Hay items con datos incompletos');
        return;
      }

      // Procesar secuencialmente en lugar de usar Promise.all
      for (const item of items) {
        if (item.rendicion_id) {
          await axios.put(`http://localhost:5000/api/rendiciones/${item.rendicion_id}`, item);
        } else {
          await axios.post(`http://localhost:5000/api/rendiciones`, item);
        }
      }

      alert('Rendiciones guardadas exitosamente');
      await fetchData();
    } catch (error) {
      console.error('Error saving rendiciones:', error);
      alert('Error al guardar las rendiciones');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-800" />
      </div>
    );
  }

  if (error || !client || !job) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            {error || (!client ? 'Cliente no encontrado' : 'Trabajo no encontrado')}
          </h2>
        </div>
      </div>
    );
  } const getProveedoresUsados = () => {
    // Obtener los IDs únicos de proveedores usados en los items
    const proveedoresIds = [...new Set(items.map(item => item.proveedor_id).filter(Boolean))];

    // Filtrar la lista de proveedores para obtener solo los usados
    return proveedores.filter(proveedor =>
      proveedoresIds.includes(proveedor.proveedor_id)
    );
  };

  return (
    <div className="flex flex-col p-5 h-full">
      <div className="h-full rounded-lg ">
        <Breadcrumb />
        <div className="p-4 bg-white shadow-md rounded-tl-lg rounded-tr-lg border-l-4 border-red-800">
          <p className="text-gray-900 font-semibold text-lg">Cliente:</p>
          <p className="text-gray-800 text-base">{client?.name}</p>

          <div className="mt-4">
            <p className="text-gray-900 font-semibold text-lg">Proyecto:</p>
            <p className="text-gray-800 text-base">{job?.project_name}</p>
          </div>
        </div>
        <div className="p-5  bg-white rounded-b-xl border-l-4  border-red-800  ">
          <div>
            <div className="flex justify-between items-center mb-4">

              <h2 className="text-xl font-semibold text-gray-800">Rendición</h2>
              <div className="text-end flex space-x-4">
                <button
                  onClick={agregarFila}
                  className="flex items-center space-x-2 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
                >
                  <FaPlus className="text-lg" />
                                 </button>

                <button
                  onClick={guardarRendiciones}
                  className="flex items-center space-x-2 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-7 00 transition duration-300"
                >
                  <FaSave className="text-lg" />
             
                </button>

                <Dpdf
                  job={job}
                  client={client}
                  items={items.map(item => ({
                    ...item,
                    proveedor_nombre: proveedores.find(p => p.proveedor_id === item.proveedor_id)?.nombre || 'N/A'
                  }))}
                  asignacionesData={asignacionesData}
                  manoObraData={manoObraData}
                  proveedores={getProveedoresUsados()}
                  formatCLP={formatCLP}
                />
              </div>
            </div>
          </div>

          <TablaRendicion
            items={items}
            handleChange={handleChange}
            deleteItem={deleteItem}
            proveedores={proveedores}
            handleProveedorChange={handleProveedorChange}
            formatCLP={formatCLP}
            agregarFila={agregarFila}
          />

          <div className="flex flex-col bg-gray-100 p-6 border-r border-l border-b border-gray-300 rounded-b-xl space-y-4 ">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center border-gray-200">
                <span className="text-md font-medium text-black">Total:</span>
                <p className="text-base text-red-700 font-bold">
                  {formatCLP(totalRendicion)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-md font-medium text-black">Saldo Actual:</span>
                <p className="text-base text-red-700 font-bold">
                  {formatCLP(asignacion.saldo_recibido)}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-md font-medium text-black">Saldo Final:</span>
                <p className="text-base text-red-700 font-bold">
                  {formatCLP(asignacion.saldo_recibido - totalRendicion)}
                </p>
              </div>
            </div>
          </div>


        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="w-full lg:w-1/2 bg-white rounded-xl p-4 md:p-5 shadow-sm  border-l-4  border-red-800 ">
            <Asignacion
              job={job}
              updateAsignacion={setAsignacion}
              asignaciones={asignacionesData}
              setAsignaciones={setAsignacionesData}
            />
          </div>

          <div className="w-full lg:w-1/2 bg-white rounded-xl p-4 md:p-6 shadow-sm border-l-4  border-red-800 ">
            <ManoObra
              job={job}
              setManoObra={setManoObraData}
              subtotal={job?.subtotal || 0}
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default Rendicion;