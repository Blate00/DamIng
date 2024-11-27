import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const ManoObra = ({ job, setManoObra, subtotal }) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    monto: '',
    tipo_pago_id: ''
  });
  const [abonosManoObra, setAbonosManoObra] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [valorManoObraModificado, setValorManoObraModificado] = useState(subtotal);
  const [error, setError] = useState(null);

  const fetchManoObraData = useCallback(async () => {
    if (!job?.quote_number) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/mano-obra/${job.quote_number}`);
      const data = response.data;
      
      if (data.length > 0) {
        const totalManoObra = data[0].total_mano_obra || 0;
        const totalRecibido = data[0].total_recibido || 0;
        const saldoActual = data[0].saldo_actual || 0;

        setAbonosManoObra(data);
        setValorManoObraModificado(totalManoObra);
        
        if (setManoObra) {
          setManoObra({
            total_mano_obra: totalManoObra,
            total_recibido: totalRecibido,
            saldo_actual: saldoActual
          });
        }
      }
    } catch (error) {
      console.error('Error al cargar mano de obra:', error);
      setError('Error al cargar los datos de mano de obra');
    }
  }, [job?.quote_number, setManoObra]);


  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tipo-pago');
        setTiposPago(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            tipo_pago_id: response.data[0].tipo_pago_id
          }));
        }
        await fetchManoObraData();
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        setError('Error al cargar los tipos de pago');
      }
    };

    loadInitialData();
  }, [fetchManoObraData]);

  useEffect(() => {
    setValorManoObraModificado(subtotal);
  }, [subtotal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      errors.monto = 'Ingrese un monto válido';
    }
    if (!formData.tipo_pago_id) {
      errors.tipo_pago_id = 'Seleccione un tipo de pago';
    }
    return errors;
  };

  const handleGuardarAbono = async (e) => {
    e.preventDefault();
    if (!job?.quote_number) {
      alert('No hay un proyecto seleccionado');
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      alert(Object.values(errors).join('\n'));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await axios.post('http://localhost:5000/api/mano-obra', {
        quote_number: job.quote_number,
        saldo_recibido: parseFloat(formData.monto),
        tipo_pago_id: formData.tipo_pago_id
      });

      await fetchManoObraData();
      
      setFormData({
        monto: '',
        tipo_pago_id: tiposPago[0]?.tipo_pago_id || ''
      });
      
      setIsModalOpen(false);
      alert('Abono guardado con éxito');
    } catch (error) {
      console.error('Error al guardar abono:', error);
      setError('Error al guardar el abono');
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

  const totalRecibido = abonosManoObra.length > 0 ? abonosManoObra[0].total_recibido : 0;
  const saldoActual = abonosManoObra.length > 0 ? abonosManoObra[0].saldo_actual : valorManoObraModificado;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-bold text-gray-800">Mano de Obra</h4>
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors duration-200 flex items-center disabled:opacity-50"
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
            <h3 className="text-2xl font-bold text-red-800">Agregar Abono Mano de Obra</h3>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-6">
            <form onSubmit={handleGuardarAbono} className="space-y-6">
              <div>
                <label htmlFor="monto" className="block text-sm font-medium text-gray-700 mb-1">
                  Monto
                </label>
                <input
                  type="number"
                  id="monto"
                  name="monto"
                  placeholder="Ingrese el monto del abono"
                  value={formData.monto}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  required
                  min="0"
                  step="1"
                />
              </div>

              <div>
                <label htmlFor="tipo_pago_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Pago
                </label>
                <select
                  id="tipo_pago_id"
                  name="tipo_pago_id"
                  value={formData.tipo_pago_id}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  required
                >
                  <option value="">Seleccione tipo de pago</option>
                  {tiposPago.map(tipo => (
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
                onClick={handleGuardarAbono}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Abono'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de totales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 mt-2">
{/* Total Mano de Obra */}
<div className="bg-gray-50 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
  <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start">
    <p className="text-xs sm:text-sm text-gray-600 mb-0 sm:mb-2">
      Total Mano de Obra
    </p>
    <p className="text-base sm:text-lg font-semibold text-gray-800">
      {formatCurrency(valorManoObraModificado)}
    </p>
  </div>
</div>

{/* Total Recibido */}
<div className="bg-gray-50 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
  <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start">
    <p className="text-xs sm:text-sm text-gray-600 mb-0 sm:mb-2">
      Total Recibido
    </p>
    <p className="text-base sm:text-lg font-semibold text-gray-800">
      {formatCurrency(totalRecibido)}
    </p>
  </div>
</div>

{/* Saldo Restante */}
<div className="bg-gray-50 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
  <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start">
    <p className="text-xs sm:text-sm text-gray-600 mb-0 sm:mb-2">
      Saldo Restante
    </p>
    <p className={`text-base sm:text-lg font-semibold ${
      saldoActual >= 0 ? 'text-red-600' : 'text-red-600'
    }`}>
      {formatCurrency(Math.abs(saldoActual))}
    </p>
  </div>
</div>
</div>

      {/* Tabla de abonos */}
      <div className="overflow-x-auto">
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
    {abonosManoObra.map((abono, index) => (
      <tr key={index} className="border-b bg-white hover:bg-gray-100 transition-colors duration-200">
        <td className="py-2 md:py-3 px-3 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium">
              {formatCurrency(abono.saldo_recibido)}
            </span>
            {/* Mostrar medio de pago en móviles */}
            <span className="text-xs text-gray-500 mt-1 sm:hidden">
              {abono.medio_pago}
            </span>
          </div>
        </td>

        {/* Celda de Medio oculta en móviles */}
        <td className="py-2 md:py-3 px-3 md:px-6 hidden sm:table-cell">
          {abono.medio_pago}
        </td>

        <td className="py-2 md:py-3 px-3 md:px-6 text-center">
          <span className="whitespace-nowrap">
            {new Date(abono.fecha_actualizacion).toLocaleDateString()}
          </span>
        </td>
      </tr>
    ))}

    {abonosManoObra.length === 0 && (
      <tr>
        <td 
          colSpan="3" 
          className="py-4 px-3 md:px-6 text-center text-gray-500 text-sm"
        >
          No hay abonos disponibles
        </td>
      </tr>
    )}
  </tbody>
</table>
</div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default ManoObra;