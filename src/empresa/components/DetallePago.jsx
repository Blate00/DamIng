import React, {useEffect} from 'react';  
import { useLocation, useNavigate } from 'react-router-dom';  
import Breadcrumb from '../../general/Breadcrumb';  
import {  
  DocumentTextIcon,  
  UserIcon,  
  MailIcon,  
  PhoneIcon,  
  CalendarIcon,  
  CurrencyDollarIcon  
} from '@heroicons/react/outline';  
import DescargarLiquidacionPDF from './Dpdf';  
const DetalleLiquidacion = () => {  
  const location = useLocation();  
  const navigate = useNavigate();  
  const { fechaPago, pagos, empleado } = location.state || {};  

  const formatCLP = (value) => {  
    return new Intl.NumberFormat('es-CL', {  
      style: 'currency',  
      currency: 'CLP',  
    }).format(value);  
  };  

  if (!location.state) {  
    return (  
      <div className="p-4 text-center">  
        <p className="text-red-600">No se encontraron datos de la liquidación</p>  
        <button  
          onClick={() => navigate('/empresa/liquidaciones')}  
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"  
        >  
          Volver a liquidaciones  
        </button>  
      </div>  
    );  
  }  

  // Cálculos de totales  
  const totales = pagos.reduce((acc, pago) => ({  
    pagoDia: acc.pagoDia + Number(pago.pago_dia),  
    colacion: acc.colacion + Number(pago.colacion),  
    gestion: acc.gestion + Number(pago.gestion),  
    extra: acc.extra + Number(pago.extra),  
    total: acc.total + Number(pago.total_payment)  
  }), {  
    pagoDia: 0,  
    colacion: 0,  
    gestion: 0,  
    extra: 0,  
    total: 0  
  });  
 useEffect(() => {  
    const fetchBankDetails = async () => {  
      if (empleado?.datos_bancarios?.banco_id) {  
        try {  
          const [bancosResponse, tiposCuentaResponse] = await Promise.all([  
            axios.get('http://localhost:5000/api/banco'),  
            axios.get('http://localhost:5000/api/tipocuenta')  
          ]);  

          const bancoInfo = bancosResponse.data.find(  
            b => b.banco_id === empleado.datos_bancarios.banco_id  
          );  
          const tipoCuentaInfo = tiposCuentaResponse.data.find(  
            t => t.tipo_cuenta_id === empleado.datos_bancarios.tipo_cuenta_id  
          );  

          setEmpleado(prev => ({  
            ...prev,  
            datos_bancarios: {  
              ...prev.datos_bancarios,  
              banco_nombre: bancoInfo?.nombre_banco || 'No especificado',  
              tipo_cuenta_nombre: tipoCuentaInfo?.nombre_tipo_cuenta || 'No especificado'  
            }  
          }));  
        } catch (error) {  
          console.error('Error fetching bank details:', error);  
        }  
      }  
    };  

    fetchBankDetails();  
  }, [empleado?.datos_bancarios?.banco_id]);  

  return (  
    <div className="flex flex-col p-3">  
      <div className="max-w-7xl mx-auto w-full">  
        <div className="p-5">  
          <Breadcrumb />  

          {/* Encabezado */}  
          <div className="mb-4">  
            <h2 className="text-2xl font-bold">  
              Detalle de Liquidación  
            </h2>  
          </div>  

          {/* Información del empleado */}  
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">  
            <h3 className="text-lg font-semibold mb-4 flex items-center">  
              <UserIcon className="h-5 w-5 mr-2" />  
              Datos del Trabajador  
            </h3>  
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">  
              <div className="flex items-center">  
                <UserIcon className="h-5 w-5 text-gray-400 mr-2" />  
                <div>  
                  <p className="text-sm text-gray-500">Nombre</p>  
                  <p className="font-medium">{empleado.nombre}</p>  
                </div>  
              </div>  
              <div className="flex items-center">  
                <MailIcon className="h-5 w-5 text-gray-400 mr-2" />  
                <div>  
                  <p className="text-sm text-gray-500">Correo</p>  
                  <p className="font-medium">{empleado.correo}</p>  
                </div>  
              </div>  
              <div className="flex items-center">  
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />  
                <div>  
                  <p className="text-sm text-gray-500">Teléfono</p>  
                  <p className="font-medium">{empleado.telefono}</p>  
                </div>  
              </div>  
            </div>  
          </div>  
            <DescargarLiquidacionPDF  
        fechaPago={fechaPago}  
        pagos={pagos}  
        empleado={empleado}  
        totales={totales}  
        formatCLP={formatCLP}  
    />  
          {/* Resumen de totales */}  
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">  
            <h3 className="text-lg font-semibold mb-4">Resumen de Pagos Semana Pagado el {fechaPago}</h3>  
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">  
              <div className="bg-gray-50 p-4 rounded-lg">  
                <p className="text-sm text-gray-500">Pago Día</p>  
                <p className="text-lg font-bold text-gray-900">{formatCLP(totales.pagoDia)}</p>  
              </div>  
              <div className="bg-gray-50 p-4 rounded-lg">  
                <p className="text-sm text-gray-500">Colación</p>  
                <p className="text-lg font-bold text-gray-900">{formatCLP(totales.colacion)}</p>  
              </div>  
              <div className="bg-gray-50 p-4 rounded-lg">  
                <p className="text-sm text-gray-500">Gestión</p>  
                <p className="text-lg font-bold text-gray-900">{formatCLP(totales.gestion)}</p>  
              </div>  
              <div className="bg-gray-50 p-4 rounded-lg">  
                <p className="text-sm text-gray-500">Extra</p>  
                <p className="text-lg font-bold text-gray-900">{formatCLP(totales.extra)}</p>  
              </div>  
              <div className="bg-red-50 p-4 rounded-lg">  
                <p className="text-sm text-red-500">Total</p>  
                <p className="text-lg font-bold text-red-600">{formatCLP(totales.total)}</p>  
              </div>  
            </div>  
          </div>  

          {/* Tabla detallada de pagos */}  
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">  
            <table className="min-w-full divide-y divide-gray-200">  
              <thead className="bg-gray-50">  
                <tr>  
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">  
                    Fecha Trabajo  
                  </th>  
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">  
                  Proyecto
                  </th>  
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">  
                    Pago Día  
                  </th>  
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">  
                    Colación  
                  </th>  
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">  
                    Gestión  
                  </th>  
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">  
                    Extra  
                  </th>  
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">  
                    Total  
                  </th>  
                </tr>  
              </thead>  
              <tbody className="bg-white divide-y divide-gray-200">  
                {pagos.map((pago, idx) => (  
                  <tr key={idx} className="hover:bg-gray-50">  
                    <td className="px-6 py-4 whitespace-nowrap">  
                      <div className="text-sm text-gray-900">{new Date(pago.trabajo_fecha).toLocaleDateString()}</div>  
                    </td>  
                    <td className="px-6 py-4 whitespace-nowrap">  
                      <div className="text-sm text-gray-900">{pago.project_name }</div>  
                    </td>  
                    <td className="px-6 py-4 text-right whitespace-nowrap">  
                      <div className="text-sm text-gray-900">{formatCLP(Number(pago.pago_dia))}</div>  
                    </td>  
                    <td className="px-6 py-4 text-right whitespace-nowrap">  
                      <div className="text-sm text-gray-900">{formatCLP(Number(pago.colacion))}</div>  
                    </td>  
                    <td className="px-6 py-4 text-right whitespace-nowrap">  
                      <div className="text-sm text-gray-900">{formatCLP(Number(pago.gestion))}</div>  
                    </td>  
                    <td className="px-6 py-4 text-right whitespace-nowrap">  
                      <div className="text-sm text-gray-900">{formatCLP(Number(pago.extra))}</div>  
                    </td>  
                    <td className="px-6 py-4 text-right whitespace-nowrap">  
                      <div className="text-sm font-medium text-gray-900">{formatCLP(Number(pago.total_payment))}</div>  
                    </td>  
                  </tr>  
                ))}  
                {/* Fila de totales */}  
                <tr className="bg-gray-50 font-medium">  
                  <td colSpan="2" className="px-6 py-4 text-right">Totales:</td>  
                  <td className="px-6 py-4 text-right">{formatCLP(totales.pagoDia)}</td>  
                  <td className="px-6 py-4 text-right">{formatCLP(totales.colacion)}</td>  
                  <td className="px-6 py-4 text-right">{formatCLP(totales.gestion)}</td>  
                  <td className="px-6 py-4 text-right">{formatCLP(totales.extra)}</td>  
                  <td className="px-6 py-4 text-right font-bold">{formatCLP(totales.total)}</td>  
                </tr>  
              </tbody>  
            </table>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
};  

export default DetalleLiquidacion;  