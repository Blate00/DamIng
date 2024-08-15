import React, { useState } from 'react';

const EgresosTrabajadores = ({ ingresos, setIngresos }) => {
  const [trabajadores, setTrabajadores] = useState([
    { nombre: 'Trabajador 1', sueldo: 0 },
    { nombre: 'Trabajador 2', sueldo: 0 },
  ]);

  const handlePago = (index) => {
    const newTrabajadores = [...trabajadores];
    const sueldo = newTrabajadores[index].sueldo;
    
    if (sueldo <= ingresos) {
      setIngresos(ingresos - sueldo);
      alert(`Pago realizado a ${newTrabajadores[index].nombre}`);
    } else {
      alert('No hay suficientes ingresos para realizar el pago.');
    }
  };

  const handleSueldoChange = (index, value) => {
    const newTrabajadores = [...trabajadores];
    newTrabajadores[index].sueldo = parseFloat(value) || 0;
    setTrabajadores(newTrabajadores);
  };

  return (
    <div>
      <h4 className="text-lg font-bold text-gray-800 mt-8 mb-4">Egresos - Pago a Trabajadores</h4>
      {trabajadores.map((trabajador, index) => (
        <div key={index} className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {trabajador.nombre}
          </label>
          <input
            type="number"
            value={trabajador.sueldo}
            onChange={(e) => handleSueldoChange(index, e.target.value)}
            className="mt-1 p-2 border rounded-md w-full"
          />
          <button
            onClick={() => handlePago(index)}
            className="mt-2 p-2 bg-red-800 text-white rounded-md hover:bg-red-900"
          >
            Pagar
          </button>
        </div>
      ))}
      <div>
        <h5 className="text-sm font-medium text-gray-700">Ingresos Disponibles</h5>
        <p className="text-sm text-gray-600">
          {ingresos.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
        </p>
      </div>
    </div>
  );
};

export default EgresosTrabajadores;
