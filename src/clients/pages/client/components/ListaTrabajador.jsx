import React, { useState } from 'react';

// Función para formatear números en formato CLP
const formatCLP = (value) => {
  if (!value) return '';
  const numericValue = value.toString().replace(/\./g, '').replace(/,/g, '.');
  const [integer, fraction] = numericValue.split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return fraction ? `${formattedInteger},${fraction}` : formattedInteger;
};

// Función para desformatear números de formato CLP a número
const parseCLP = (value) => {
  if (!value) return 0;
  return parseFloat(value.replace(/\./g, '').replace(/,/g, '.')) || 0;
};

const AccesoPago = ({ trabajadores }) => {
  const [rows, setRows] = useState([{}]); // Estado para manejar las filas

  const handleAddRow = () => {
    setRows([...rows, {}]); // Agregar una nueva fila
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRows = [...rows];

    if (name === 'trabajador' || name === 'fecha') {
      // Manejar inputs que no requieren conversión numérica
      updatedRows[index] = {
        ...updatedRows[index],
        [name]: value,
      };
    } else {
      // Desformatear el valor para campos numéricos
      const numericValue = parseCLP(value);
      updatedRows[index] = {
        ...updatedRows[index],
        [name]: numericValue,
      };

      // Calcular el total
      const { pagoDia = 0, colacion = 0, gestion = 0, extra = 0 } = updatedRows[index];
      const total = pagoDia + colacion + gestion + extra;

      updatedRows[index].total = total;
    }

    setRows(updatedRows);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className='bg-gray-100'>
          <tr>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Trabajador</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Fecha</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Pago Día</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Colación</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Gestión</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Extra</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Total</th>
            <th className="py-3 px-4 text-center font-semibold text-gray-900">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-4">
                <select
                  name="trabajador"
                  value={row.trabajador || ''}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                >
                  <option value="">Selecciona un trabajador</option>
                  {trabajadores.map((trabajador) => (
                    <option key={trabajador.id} value={trabajador.id}>
                      {trabajador.nombre}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2 px-4">
                <input
                  type="date"
                  name="fecha"
                  value={row.fecha || ''}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  name="pagoDia"
                  value={formatCLP(row.pagoDia) || ''}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  name="colacion"
                  value={formatCLP(row.colacion) || ''}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  name="gestion"
                  value={formatCLP(row.gestion) || ''}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  name="extra"
                  value={formatCLP(row.extra) || ''}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  name="total"
                  value={formatCLP(row.total) || ''}
                  className="w-full px-2 py-1 border border-gray-300 rounded"
                  readOnly
                />
              </td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleDeleteRow(index)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    
    </div>
  );
};

export default AccesoPago;