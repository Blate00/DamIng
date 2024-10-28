import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import { supabase } from '../../../../../supabase/client';

const Asignacion = ({ job, updateAsignacion }) => {
  const [desplegado, setDesplegado] = useState(false);
  const [nuevoAbono, setNuevoAbono] = useState('');
  const [loading, setLoading] = useState(false);
  const [asignaciones, setAsignaciones] = useState([]);

  useEffect(() => {
    const fetchAsignaciones = async () => {
      if (!job || !job.quote_number) {
        console.error('Job or quote_number is undefined');
        return;
      }

      try {
        const { data: asignacionesData, error } = await supabase
          .from('asignacion')
          .select('*')
          .eq('quote_number', job.quote_number)
          .order('fecha_actualizacion', { ascending: false });

        if (error) throw error;

        setAsignaciones(asignacionesData || []);
        if (updateAsignacion && asignacionesData.length > 0) {
          updateAsignacion(asignacionesData[0]); // Actualizar con la asignación más reciente
        }
      } catch (error) {
        console.error('Error fetching asignaciones:', error);
      }
    };

    fetchAsignaciones();
  }, [job, updateAsignacion]);

  const handleGuardarAbono = async () => {
    if (!job || !job.quote_number) {
      alert('Datos de asignación incompletos. Verifique e intente de nuevo.');
      return;
    }

    try {
      setLoading(true);
      const monto = parseFloat(nuevoAbono);
      if (isNaN(monto) || monto <= 0) {
        alert('Por favor, ingrese un monto válido.');
        return;
      }

      const totalRendiciones = await calcularTotalRendiciones();
      const ultimaAsignacion = asignaciones[0] || { saldo_recibido: 0, saldo_actual: 0 };
      const nuevoSaldoRecibido = ultimaAsignacion.saldo_recibido + monto;
      const nuevoSaldoActual = nuevoSaldoRecibido - totalRendiciones;

      const { data: nuevaAsignacion, error } = await supabase
        .from('asignacion')
        .insert({
          quote_number: job.quote_number,
          saldo_recibido: nuevoSaldoRecibido,
          saldo_actual: nuevoSaldoActual,
          fecha_actualizacion: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      setAsignaciones([nuevaAsignacion, ...asignaciones]);
      if (updateAsignacion) updateAsignacion(nuevaAsignacion);
      setNuevoAbono('');
      alert('Abono guardado con éxito');
    } catch (error) {
      console.error('Error saving abono:', error.message);
      alert('Hubo un error al guardar el abono. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const calcularTotalRendiciones = async () => {
    try {
      const { data: rendicionesData, error } = await supabase
        .from('rendiciones')
        .select('total')
        .eq('quote_number', job.quote_number);

      if (error) throw error;

      return rendicionesData.reduce((total, rendicion) => total + (rendicion.total || 0), 0);
    } catch (error) {
      console.error('Error calculating rendiciones:', error);
      return 0;
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setDesplegado(!desplegado)}>
        <h4 className="text-xl font-bold text-gray-800">Asignación</h4>
        {desplegado ? (
          <ChevronUpIcon className="w-6 h-6 text-gray-800" />
        ) : (
          <ChevronDownIcon className="w-6 h-6 text-gray-800" />
        )}
      </div>

      {desplegado && (
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
      )}
    </div>
  );
};

export default Asignacion;