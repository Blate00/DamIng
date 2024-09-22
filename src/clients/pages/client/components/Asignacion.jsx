import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import { supabase } from '../../../../supabase/client';

const Asignacion = ({ projectId, job }) => {
  const [desplegado, setDesplegado] = useState(false);
  const [nuevoAbono, setNuevoAbono] = useState('');
  const [loading, setLoading] = useState(false);
  const [asignacion, setAsignacion] = useState(null);

  useEffect(() => {
    const fetchAsignacion = async () => {
      if (!job || !job.quote_number) {
        console.error('Job or quote_number is undefined');
        return; // Salir si job o quote_number no están definidos
      }

      try {
        const { data: asignacionData, error: asignacionError } = await supabase
          .from('asignacion')
          .select('*')
          .eq('quote_number', job.quote_number) // Usar quote_number
          .single();

        if (asignacionError) throw asignacionError;

        setAsignacion(asignacionData);
      } catch (error) {
        console.error('Error fetching asignacion:', error);
      }
    };

    fetchAsignacion();
  }, [job]); // Dependencia de job

  const handleGuardarAbono = async () => {
    try {
      setLoading(true);
      const monto = parseFloat(nuevoAbono);
      if (isNaN(monto) || monto <= 0) {
        alert('Por favor, ingrese un monto válido.');
        return;
      }

      const nuevoSaldoRecibido = (asignacion?.saldo_recibido || 0) + monto;

      // Actualizar la asignación con el nuevo abono
      const { data: asignacionActualizada, error: asignacionError } = await supabase
        .from('asignacion')
        .update({
          saldo_recibido: nuevoSaldoRecibido,
          saldo_actual: nuevoSaldoRecibido - (await calcularTotalRendiciones()), // Calcular saldo actual
          fecha_actualizacion: new Date().toISOString()
        })
        .eq('quote_number', job.quote_number) // Usar quote_number
        .select()
        .single();

      if (asignacionError) throw asignacionError;

      setAsignacion(asignacionActualizada);
      setNuevoAbono('');
      alert('Abono guardado con éxito');
    } catch (error) {
      console.error('Error saving abono:', error.message);
      alert('Hubo un error al guardar el abono. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular el total de rendiciones
  const calcularTotalRendiciones = async () => {
    const { data: rendicionesData, error } = await supabase
      .from('rendiciones')
      .select('total')
      .eq('quote_number', job.quote_number);

    if (error) {
      console.error('Error fetching rendiciones:', error);
      return 0;
    }

    return rendicionesData.reduce((total, rendicion) => total + rendicion.total, 0);
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
                <th className="py-3 px-6 text-left text-gray-100">Última Actualización</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b bg-white hover:bg-gray-100">
                <td className="py-3 px-6">
                  {(asignacion?.saldo_recibido || 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </td>
                <td className="py-3 px-6">
                  {(asignacion?.saldo_actual || 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                </td>
                <td className="py-3 px-6">
                  {asignacion?.fecha_actualizacion ? new Date(asignacion.fecha_actualizacion).toLocaleString() : 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Asignacion;