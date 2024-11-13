// Asignacion.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Asignacion = ({ job, updateAsignacion, asignaciones, setAsignaciones }) => {
  const [desplegado, setDesplegado] = useState(false);
  const [nuevoAbono, setNuevoAbono] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAsignaciones = async () => {
      if (!job?.quote_number) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/asignacion/${job.quote_number}`);
        const asignacionesData = response.data || [];
        setAsignaciones(asignacionesData);
        
        if (updateAsignacion && asignacionesData.length > 0) {
          const totalAsignaciones = asignacionesData[0].total_asignaciones || 0;
          const ultimoSaldoActual = asignacionesData[0].saldo_actual || 0;
          
          updateAsignacion({
            saldo_recibido: totalAsignaciones,
            saldo_actual: ultimoSaldoActual
          });
        }
      } catch (error) {
        console.error('Error fetching asignaciones:', error);
      }
    };

    fetchAsignaciones();
  }, [job?.quote_number, updateAsignacion, setAsignaciones]);

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

      // Después de guardar, obtener las asignaciones actualizadas
      const updatedResponse = await axios.get(`http://localhost:5000/api/asignacion/${job.quote_number}`);
      const updatedAsignaciones = updatedResponse.data || [];
      
      setAsignaciones(updatedAsignaciones);
      
      if (updateAsignacion && updatedAsignaciones.length > 0) {
        const totalAsignaciones = updatedAsignaciones[0].total_asignaciones || 0;
        const ultimoSaldoActual = updatedAsignaciones[0].saldo_actual || 0;
        
        updateAsignacion({
          saldo_recibido: totalAsignaciones,
          saldo_actual: ultimoSaldoActual
        });
      }

      setNuevoAbono('');
      alert('Abono guardado con éxito');
    } catch (error) {
      console.error('Error saving abono:', error);
      alert('Error al guardar el abono');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    try {
      return Number(value).toLocaleString('es-CL', { 
        style: 'currency', 
        currency: 'CLP' 
      });
    } catch (error) {
      return 'CLP \$0';
    }
  };

  const calcularSaldoFinal = (asignacion) => {
    const totalAsignaciones = Number(asignacion?.total_asignaciones || 0);
    const totalRendiciones = Number(asignacion?.total_rendiciones || 0);
    return totalAsignaciones - totalRendiciones;
  };

  return (
    <div className="mb-6 mt-5">
      <h4 className="text-xl font-bold text-gray-800">Asignación</h4>
      
      {/* Resumen de totales */}
      {Array.isArray(asignaciones) && asignaciones.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-4 mt-2">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Asignaciones</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatCurrency(asignaciones[0]?.total_asignaciones)}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Rendiciones</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatCurrency(asignaciones[0]?.total_rendiciones)}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Saldo Final</p>
            <p className={`text-lg font-semibold ${calcularSaldoFinal(asignaciones[0]) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(calcularSaldoFinal(asignaciones[0]))}
            </p>
          </div>
        </div>
      )}

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
            <th className="py-3 px-6 text-left text-gray-100">Total Acumulado</th>
            <th className="py-3 px-6 text-left text-gray-100">Total Rendiciones</th>
            <th className="py-3 px-6 text-left text-gray-100">Saldo Final</th>
            <th className="py-3 px-6 text-left text-gray-100">Fecha</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {Array.isArray(asignaciones) && asignaciones.map((asignacion, index) => (
            <tr key={index} className="border-b bg-white hover:bg-gray-100">
              <td className="py-3 px-6">{formatCurrency(asignacion?.saldo_recibido)}</td>
              <td className="py-3 px-6">{formatCurrency(asignacion?.saldo_actual)}</td>
              <td className="py-3 px-6">{formatCurrency(asignacion?.total_asignaciones)}</td>
              <td className="py-3 px-6">{formatCurrency(asignacion?.total_rendiciones)}</td>
              <td className={`py-3 px-6 ${calcularSaldoFinal(asignacion) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(calcularSaldoFinal(asignacion))}
              </td>
              <td className="py-3 px-6">
                {asignacion?.fecha_actualizacion ? 
                  new Date(asignacion.fecha_actualizacion).toLocaleString() : 
                  'Fecha no disponible'
                }
              </td>
            </tr>
          ))}
          {(!Array.isArray(asignaciones) || asignaciones.length === 0) && (
            <tr>
              <td colSpan="6" className="py-3 px-6 text-center text-gray-500">
                No hay asignaciones disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Asignacion;