import React, { useState, useEffect } from 'react';
import AccesoPago from './components/ListaTrabajador';

const FlujoCaja = () => {
  const [abonosManoObra, setAbonosManoObra] = useState(JSON.parse(localStorage.getItem('abonosManoObra')) || []);
  const [trabajadores, setTrabajadores] = useState([]);

  useEffect(() => {
    const savedTrabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];
    if (savedTrabajadores) setTrabajadores(savedTrabajadores);
  }, []);

  const totalRecibido = abonosManoObra.reduce((total, abono) => total + abono.monto, 0);

  const handleDeleteTrabajador = (index) => {
    const updatedTrabajadores = trabajadores.filter((_, i) => i !== index);
    setTrabajadores(updatedTrabajadores);
    localStorage.setItem('trabajadores', JSON.stringify(updatedTrabajadores));
  };

  return (
    <div className="uwu3 flex flex-col p-3 bg-white h-full">
        <div className="bg-white rounded-lg">
            <div className="p-5">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg mb-7">
        <thead className="bg-red-800 border-b border-gray-200">
          <tr>
            <th className="py-3 px-4 text-left text-gray-100">Cliente</th>
            <th className="py-2 px-4 text-right text-gray-100">Trabajo</th>
            <th className="py-2 px-4 text-right text-gray-100">Dinero Disponible: {totalRecibido.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</th>
            </tr>
            </thead>
            </table>

<h2 className="text-xl font-semibold mb-4 text-gray-800">Lista de Trabajadores</h2>
      <AccesoPago
        trabajadores={trabajadores}
        onDeleteTrabajador={handleDeleteTrabajador}
      />
      {/* Otros elementos del flujo de caja pueden ir aquí */}
    </div></div></div>
  );
};

export default FlujoCaja;
