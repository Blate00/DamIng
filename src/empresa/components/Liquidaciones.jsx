// components/Liquidaciones.jsx  
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../../general/Breadcrumb';
import { DocumentTextIcon, DownloadIcon, UserIcon, MailIcon, PhoneIcon, ArrowLeftIcon } from '@heroicons/react/outline';

const Liquidaciones = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentsByDate, setPaymentsByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extraer datos del estado  
  const { nombre, correo, telefono, employee_id,banco,account } = location.state || {};
  const formatCLP = (value) => {  
    return new Intl.NumberFormat('es-CL', {  
      style: 'currency',  
      currency: 'CLP',  
    }).format(value);  
  }; 
  useEffect(() => {
    const fetchPayments = async () => {
      if (!employee_id) {
        setError('No se recibió ID del empleado');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching payments for employee:', employee_id);
        const response = await axios.get(`http://localhost:5000/api/empleados/${employee_id}/payments`);
        console.log('Payments response:', response.data);
        setPaymentsByDate(response.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [employee_id]);

  // Si no hay datos del empleado, redirigir  
  if (!location.state) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">No se encontraron datos del empleado</p>
        <button
          onClick={() => navigate('/empresa')}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Volver a la lista de empleados
        </button>
      </div>
    );
  }
  const handleFechaPagoClick = async (fechaPago, pagosPreview) => {
    try {
      // Obtener los pagos detallados para esta fecha específica  
      const response = await axios.get(
        `http://localhost:5000/api/empleados/${employee_id}/payments/${fechaPago}`
      );

      // Navegar al detalle con todos los datos necesarios  
      navigate('/empresa/liquidaciones/detalle', {
        state: {
          fechaPago,
          pagos: response.data, // Usamos los pagos detallados de la fecha específica  
          empleado: {
            nombre,
            correo,
            telefono,
            employee_id
          }
        }
      });
    } catch (error) {
      console.error('Error al obtener detalles de pagos:', error);
      setError(error.message);
    }
  };
  return (
    <div className="flex flex-col p-3">
      <div className="max-w-7xl mx-auto w-full">
        <div className="p-5">
          <Breadcrumb />

          {/* Información del empleado */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Pagos Registrados
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Datos del Trabajador
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Nombre</p>
                    <p className="font-medium">{nombre || 'No disponible'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MailIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Correo</p>
                    <p className="font-medium">{correo || 'No disponible'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium">{telefono || 'No disponible'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estado de carga */}
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded-r-lg">
              <div className="flex items-center">
                <ExclamationIcon className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          ) : Object.entries(paymentsByDate).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(paymentsByDate).map(([fechaPago, pagos]) => (
                <div
                  key={fechaPago}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => handleFechaPagoClick(fechaPago, pagos)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-6 w-6 text-red-600 mr-2" />
                      <div>
                        <h3 className="text-lg font-semibold">
                          Liquidación
                        </h3>
                        <p className="text-sm text-gray-500">
                          {fechaPago}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCLP(pagos.reduce((sum, pago) => sum + Number(pago.total_payment), 0))}  
                      </p>
                      <p className="text-sm text-gray-500">
                        {pagos.length} {pagos.length === 1 ? 'pago' : 'pagos'}
                      </p>
                    </div>
                  </div>

                  {/* Vista previa de pagos */}
                  <div className="space-y-2">
                    {pagos.slice(0, 2).map((pago, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded"
                      >
                        <div>
                          <p className="font-medium">{pago.project_name || 'Proyecto sin nombre'}</p>
                          <p className="text-sm text-gray-500">
                            Fecha trabajo: {pago.fecha_trabajo || 'No disponible'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                           {formatCLP(Number(pago.total_payment || 0))}                            </p>

                        </div>
                      </div>
                    ))}
                    {pagos.length > 2 && (
                      <div className="text-center py-2 text-sm text-gray-500 bg-gray-50 rounded mt-2">
                        Click para ver {pagos.length - 2} pagos más...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                No se encontraron pagos registrados para este empleado
              </p>
              <button
                onClick={() => navigate('/empresa')}
                className="mt-4 text-red-600 hover:text-red-700 font-medium"
              >
                Volver a la lista de empleados
              </button>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default Liquidaciones;  