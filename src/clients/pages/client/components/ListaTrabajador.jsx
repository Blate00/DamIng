import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleAddRow = () => {
    setRows([...rows, {}]); // Agregar una nueva fila
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRows = [...rows];

    // Desformatear el valor antes de actualizar el estado
    const numericValue = name.includes('total') ? parseCLP(value) : value;

    updatedRows[index] = {
      ...updatedRows[index],
      [name]: numericValue,
    };

    // Calcular el total
    const { pagoDia = '0', colacion = '0', gestion = '0', extra = '0' } = updatedRows[index];
    const total = [pagoDia, colacion, gestion, extra]
      .map(parseCLP)
      .reduce((acc, curr) => acc + curr, 0)
      .toFixed(2); // Usar .toFixed(2) para dos decimales

    updatedRows[index].total = formatCLP(total);

    setRows(updatedRows);

    // Si el campo seleccionado es el trabajador y es la primera vez que se selecciona, agregar una nueva fila
    if (name === 'trabajador' && value !== '' && index === rows.length - 1) {
      handleAddRow();
    }
  };

  const handleSaveData = () => {
    // Guardar los datos en localStorage
    const pagos = rows.map(row => ({
      trabajadorId: row.trabajador,
      fecha: row.fecha,
      pagoDia: parseCLP(row.pagoDia),
      colacion: parseCLP(row.colacion),
      gestion: parseCLP(row.gestion),
      extra: parseCLP(row.extra),
      total: parseCLP(row.total),
    }));
    localStorage.setItem('pagos', JSON.stringify(pagos));
    alert('Datos guardados exitosamente!');
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  return (
    <div className="rounded-lg p-4">
      <table className="min-w-full bg-white shadow-md">
        <thead>
          <tr>
            <th className="py-2 px-4 text-center">Trabajador</th>
            <th className="py-2 px-4 text-center">Fecha</th>
            <th className="py-2 px-4 text-center">Pago Día</th>
            <th className="py-2 px-4 text-center">Colación</th>
            <th className="py-2 px-4 text-center">Gestión</th>
            <th className="py-2 px-4 text-center">Extra</th>
            <th className="py-2 px-4 text-center">Total</th>
            <th className="py-2 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-gray-200 hover:bg-gray-50">
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
                  className="px-3 py-1 text-white bg-red-500 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-red-800">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <button
          onClick={handleSaveData}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Guardar Datos
        </button>
      </div>
    </div>
  );
};

export default AccesoPago;
