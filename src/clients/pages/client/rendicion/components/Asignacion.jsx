// Asignacion.jsx
import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import axios from 'axios';

const Asignacion = ({ job, updateAsignacion }) => {
  const [desplegado, setDesplegado] = useState(false);
  const [nuevoAbono, setNuevoAbono] = useState('');
  const [loading, setLoading] = useState(false);
  const [asignaciones, setAsignaciones] = useState([]);

  useEffect(() => {
    const fetchAsignaciones = async () => {
      if (!job?.quote_number) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/asignacion/${job.quote_number}`);
        setAsignaciones(response.data || []);
        
        if (updateAsignacion && response.data.length > 0) {
          updateAsignacion(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching asignaciones:', error);
      }
    };

    fetchAsignaciones();
  }, [job, updateAsignacion]);

  const handleGuardarAbono = async () => {
    if (!job?.quote_number) {
      alert('Datos de asignación incompletos');
      return;
    }

    try {
      setLoading(true);
      const monto = parseFloat(nuevoAbono);
      
      if (isNaN(monto) || monto <= 0) {
        alert('Por favor, ingrese un monto válido');
        return;
      }

      const response = await axios.post(`http://localhost:5000/api/asignacion`, {
        quote_number: job.quote_number,
        saldo_recibido: monto
      });

      setAsignaciones([response.data, ...asignaciones]);
      if (updateAsignacion) updateAsignacion(response.data);
      setNuevoAbono('');
      alert('Abono guardado con éxito');
    } catch (error) {
      console.error('Error saving abono:', error);
      alert('Error al guardar el abono');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mb-6 mt-5">
     
        <h4 className="text-xl font-bold text-gray-800">Asignación</h4>
       

      
        <>
          <div className="mt-3 grid grid-cols-2 mb-5 gap-4">
            <input
              type="number"
              value={nuevoAbono}
              placeholder="Ingrese el monto del abono"
              onChange={(e) => setNuevoAbono(e.target.value)}
              className="p-2 border border-gray-300 rounded-md bg-white"
            />
            
            <button
              onClick={handleGuardarAbono}
              disabled={loading}
              className={`bg-red-800 text-white py-2 px-4 rounded-md hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Guardando...' : 'Guardar Abono'}
            </button>
          </div>

          <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md overflow-hidden mb-4">
            <thead className="bg-red-800 border-b border-gray-300">
              <tr>
                <th className="py-3 px-6 text-left text-gray-100">Saldo Recibido</th>
                <th className="py-3 px-6 text-left text-gray-100">Saldo Actual</th>
                <th className="py-3 px-6 text-left text-gray-100">Fecha de Actualización</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {asignaciones.map((asignacion, index) => (
                <tr key={index} className="border-b bg-white hover:bg-gray-100">
                  <td className="py-3 px-6">
                    {asignacion.saldo_recibido.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                  </td>
                  <td className="py-3 px-6">
                    {asignacion.saldo_actual.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                  </td>
                  <td className="py-3 px-6">
                    {new Date(asignacion.fecha_actualizacion).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
    </div>
  );
};

export default Asignacion;