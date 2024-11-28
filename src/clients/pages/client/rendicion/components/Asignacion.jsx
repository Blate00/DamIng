// Asignacion.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Asignacion = ({ job, updateAsignacion, asignaciones, setAsignaciones }) => {
  const [loading, setLoading] = useState(false);
  const [tiposPago, setTiposPago] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    monto: '',
    tipo_pago_id: ''
  });

  useEffect(() => {
    const fetchTiposPago = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tipo-pago');
        setTiposPago(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            tipo_pago_id: response.data[0].tipo_pago_id
          }));
        }
      } catch (error) {
        console.error('Error fetching tipos de pago:', error);
      }
    };

    fetchTiposPago();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleGuardarAbono = async (e) => {
    e.preventDefault();
    if (!job?.quote_number) {
      alert('Datos de asignación incompletos');
      return;
    }

    try {
      setLoading(true);
      const monto = parseFloat(formData.monto);
      
      if (isNaN(monto) || monto <= 0) {
        alert('Por favor, ingrese un monto válido');
        return;
      }

      await axios.post(`http://localhost:5000/api/asignacion`, {
        quote_number: job.quote_number,
        saldo_recibido: monto,
        tipo_pago_id: formData.tipo_pago_id
      });

      const updatedResponse = await axios.get(`http://localhost:5000/api/asignacion/${job.quote_number}`);
      const updatedAsignaciones = updatedResponse.data || [];
      
      setAsignaciones(updatedAsignaciones);
      
      if (updateAsignacion && updatedAsignaciones.length > 0) {
        updateAsignacion({
          saldo_recibido: updatedAsignaciones[0].total_asignaciones || 0,
          saldo_actual: updatedAsignaciones[0].saldo_actual || 0
        });
      }

      setFormData({ monto: '', tipo_pago_id: tiposPago[0]?.tipo_pago_id || '' });
      setIsModalOpen(false);
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
    <div className="mb-6 ">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-bold text-gray-800">Asignación</h4>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Modal */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-[#f1f7fc] to-white shadow-2xl transform ${isModalOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-red-100">
            <h3 className="text-2xl font-bold text-red-800">Agregar Abono</h3>
            <button onClick={() => setIsModalOpen(false)} className="text-red-500 hover:text-red-700 transition-colors duration-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-6">
            <form onSubmit={handleGuardarAbono} className="space-y-6">
              <div>
                <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                <input
                  type="number"
                  id="monto"
                  name="monto"
                  placeholder="Ingrese el monto del abono"
                  value={formData.monto}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="tipo_pago_id" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pago</label>
                <select
                  id="tipo_pago_id"
                  name="tipo_pago_id"
                  value={formData.tipo_pago_id}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  required
                >
                  <option value="">Seleccione Tipo de Pago</option>
                  {tiposPago.map((tipo) => (
                    <option key={tipo.tipo_pago_id} value={tipo.tipo_pago_id}>
                      {tipo.nombre_pago}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>
          <div className="border-t border-red-100 p-6">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={handleGuardarAbono}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {loading ? 'Guardando...' : 'Guardar Abono'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de totales */}
      {Array.isArray(asignaciones) && asignaciones.length > 0 && (
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 mt-2">
       {/* Total Asignaciones */}
       <div className="bg-gray-50 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
         <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start">
           <p className="text-xs sm:text-sm text-gray-600 mb-0 sm:mb-2">
             Total Asignaciones
           </p>
           <p className="text-base sm:text-lg font-semibold text-gray-800">
             {formatCurrency(asignaciones[0]?.total_asignaciones)}
           </p>
         </div>
       </div>
       
       {/* Total Rendiciones */}
       <div className="bg-gray-50 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
         <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start">
           <p className="text-xs sm:text-sm text-gray-600 mb-0 sm:mb-2">
             Total Rendiciones
           </p>
           <p className="text-base sm:text-lg font-semibold text-gray-800">
             {formatCurrency(asignaciones[0]?.total_rendiciones)}
           </p>
         </div>
       </div>
       
       {/* Saldo Final */}
       <div className="bg-gray-50 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
         <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start">
           <p className="text-xs sm:text-sm text-gray-600 mb-0 sm:mb-2">
             Saldo Final
           </p>
           <p className={`text-base sm:text-lg font-semibold ${
             calcularSaldoFinal(asignaciones[0]) >= 0 ? 'text-green-600' : 'text-red-600'
           }`}>
             {formatCurrency(calcularSaldoFinal(asignaciones[0]))}
           </p>
         </div>
       </div>
       </div>
      )}

      {/* Tabla de asignaciones */}
      <div className="overflow-x-auto w-full">
<table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md overflow-hidden mb-4">
  <thead className="bg-red-800 border-b border-gray-300">
    <tr>
      <th className="py-2 md:py-3 px-3 md:px-6 text-left text-xs md:text-sm text-gray-100 font-medium">
        Monto Recibido
      </th>
      <th className="py-2 md:py-3 px-3 md:px-6 text-left text-xs md:text-sm text-gray-100 font-medium hidden sm:table-cell">
        Medio
      </th>
      <th className="py-2 md:py-3 px-3 md:px-6 text-left text-xs md:text-sm text-gray-100 font-medium">
        Fecha
      </th>
    </tr>
  </thead>
  <tbody className="text-gray-700 text-sm md:text-base">
    {Array.isArray(asignaciones) && asignaciones.map((asignacion, index) => (
      <tr key={index} className="border-b bg-white hover:bg-gray-100 transition-colors duration-200">
        <td className="py-2 md:py-3 px-3 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium">
              {formatCurrency(asignacion?.saldo_recibido)}
            </span>
            {/* Mostrar medio de pago en móviles */}
            <span className="text-xs text-gray-500 mt-1 sm:hidden">
              {asignacion?.medio_pago || 'No especificado'}
            </span>
          </div>
        </td>

        {/* Celda de Medio oculta en móviles */}
        <td className="py-2 md:py-3 px-3 md:px-6 hidden sm:table-cell">
          {asignacion?.medio_pago || 'No especificado'}
        </td>

        <td className="py-2 md:py-3 px-3 md:px-6 text-center">
          <span className="whitespace-nowrap text-sm">
            {asignacion?.fecha_actualizacion ? 
              new Date(asignacion.fecha_actualizacion).toLocaleString() : 
              'Fecha no disponible'
            }
          </span>
        </td>
      </tr>
    ))}

    {(!Array.isArray(asignaciones) || asignaciones.length === 0) && (
      <tr>
        <td 
          colSpan="3" 
          className="py-4 px-3 md:px-6 text-center text-gray-500 text-sm"
        >
          No hay asignaciones disponibles
        </td>
      </tr>
    )}
  </tbody>
</table>
</div>
    </div>
  );
};

export default Asignacion;