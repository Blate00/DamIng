import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const RegistroPagos = () => {
  const location = useLocation();
  const trabajadorId = location.state?.trabajadorId;
  const [pagos, setPagos] = useState([]);
  
  useEffect(() => {
    const pagosGuardados = JSON.parse(localStorage.getItem('pagos')) || [];
    const pagosFiltrados = pagosGuardados.filter(p => p.trabajadorId === trabajadorId);
    setPagos(pagosFiltrados);
  }, [trabajadorId]);

  const calcularTotalHaberes = () => {
    return pagos.reduce((total, pago) => total + pago.total, 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  };
  return (
    <div className="p-6  min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Registro de Pagos</h2>
      
      {pagos.length === 0 ? (
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200 text-center text-gray-600">
          No hay pagos registrados para este trabajador.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className=''>
              <tr className="bg-red-800 border-b border-gray-200">
                <th className="px-4 py-2 text-left text-gray-100">CONCEPTO</th>
                <th className="px-4 py-2 text-left text-gray-100">HABERES</th>
              </tr>
            </thead>
            <tbody>
              {/* Haberes */}
              <tr>
                <td className="px-4 py-2 font-bold text-gray-800">Haberes</td>
                <td className="px-4 py-2"></td>
              </tr>
              {pagos.map((pago, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-4 py-2 font-bold text-gray-800 ">Fecha:<span className='font-bold '> {pago.fecha}  </span>Pago Día:<span className='font-semibold ml-2'>{pago.pagoDia}</span>  Colación: <span className='font-semibold ml-2 '> {pago.colacion}</span> Gestión: <span className='font-semibold ml-2'>{pago.gestion}</span>  Extra: <span className='font-semibold ml-2'>{pago.extra}</span></td>
                  <td className="px-4 py-2 text-gray-800"> <span className='font-bold'>Saldo Total:</span>{pago.total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</td>
                </tr>
              ))}

              

              {/* Otros Descuentos */}
             
              {/* Agregar aquí filas para otros descuentos si existen */}

              {/* Totales */}
              <tr className="border-t border-gray-200">
                <td className=" py-2 text-right font-bold text-gray-800">TOTALES:</td>
                <td className="px-4 py-2 text-gray-800">{calcularTotalHaberes()}</td>
              </tr>
             
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RegistroPagos;
