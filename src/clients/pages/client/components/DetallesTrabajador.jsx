import React, { useState, useEffect } from 'react';

const TrabajadorDetalle = ({ trabajadorId }) => {
  const [trabajador, setTrabajador] = useState(null);

  useEffect(() => {
    const trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];
    const trabajadorSeleccionado = trabajadores.find(t => t.id === trabajadorId);
    setTrabajador(trabajadorSeleccionado);
  }, [trabajadorId]);

  if (!trabajador) {
    return <div className="p-4">Trabajador no encontrado</div>;
  }

  return (
    <div className="bg-white p-4 mb-">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Detalle del Trabajador</h3>
      <table className="min-w-full bg-white ">
        <tbody>
          <tr className="">
            <td className="px-4 py-2 text-sm font-medium text-gray-800">Nombre: David Coo {trabajador.apellido}</td>
<td className="px-4 py-2 text-sm font-medium text-gray-800">Correo: antoniodavidcoo@gmail.com</td>
            <td className="px-4 py-2 text-sm text-gray-600"></td>         
               <td className="px-4 py-2 text-sm font-medium text-gray-800">Banco de Pago: Banco Estado</td>
               <td className="px-4 py-2 text-sm font-medium text-gray-800">Tipo de Cuenta: Vista</td>
          </tr>
          <tr className="">
            
          </tr>
          <tr className="">
            
            <td className="px-4 py-2 text-sm font-medium text-gray-800">Fecha de Pago: 08-09-2024</td>  
             <td className="px-4 py-2 text-sm font-medium text-gray-800"></td>
          </tr>
          <tr>

           
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TrabajadorDetalle;
