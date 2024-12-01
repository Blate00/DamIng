import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

const formatCLP = (value) => {
  if (!value) return '';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(value);
};

const parseCLP = (value) => {
  if (!value) return 0;
  const numericValue = value.toString().replace(/[^\d,-]/g, '');
  return parseInt(numericValue) || 0;
};

const ListaTrabajador = forwardRef(({ projectId, quoteNumber, onUpdateTotal }, ref) => {
  const [rows, setRows] = useState([{}]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Función para cargar empleados
  const fetchEmpleados = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/flujo/employees');
      setEmpleados(response.data || []);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
      setError('Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar pagos del proyecto
  const fetchProjectPayments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/flujo/payments/project/${projectId}`);
      if (response.data.success) {
        const filteredPayments = response.data.data
          .filter(payment => payment.quote_number === quoteNumber)
          .map(payment => ({
            trabajador: payment.employee_id,
            employee_name: payment.employee_name,
            fecha: payment.trabajo_fecha,
            pagoDia: payment.pago_dia,
            colacion: payment.colacion,
            gestion: payment.gestion,
            extra: payment.extra,
            total: payment.total_payment,
            isRegistered: true
          }));
        setRows([...filteredPayments, {}]);
        calculateTotal([...filteredPayments, {}]);
      }
    } catch (error) {
      console.error('Error al cargar pagos del proyecto:', error);
    }
  };

  // Efectos
  useEffect(() => {
    fetchEmpleados();
  }, []);

  useEffect(() => {
    if (projectId && quoteNumber) {
      fetchProjectPayments();
    }
  }, [projectId, quoteNumber]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRows = [...rows];
  
    if (name === 'trabajador') {
      updatedRows[index] = {
        ...updatedRows[index],
        [name]: value,
      };
      setSelectedEmployee(value);
    } else if (name === 'fecha') {
      updatedRows[index] = {
        ...updatedRows[index],
        [name]: value,
      };
    } else {
      const numericValue = parseCLP(value);
      updatedRows[index] = {
        ...updatedRows[index],
        [name]: numericValue,
      };
  
      // Recalcular el total de la fila
      const { pagoDia = 0, colacion = 0, gestion = 0, extra = 0 } = updatedRows[index];
      const rowTotal = parseInt(pagoDia) + parseInt(colacion) + parseInt(gestion) + parseInt(extra);
      updatedRows[index].total = rowTotal;
    }
  
    setRows(updatedRows);
    calculateTotal(updatedRows);
  };

  const calculateTotal = (currentRows) => {
    // Total de nuevos pagos (filas sin isRegistered)
    const newPaymentsTotal = currentRows
      .filter(row => !row.isRegistered)
      .reduce((sum, row) => {
        const rowTotal = (
          (parseInt(row.pagoDia) || 0) +
          (parseInt(row.colacion) || 0) +
          (parseInt(row.gestion) || 0) +
          (parseInt(row.extra) || 0)
        );
        return sum + rowTotal;
      }, 0);
  
    // Total de pagos registrados (filas con isRegistered)
    const registeredPaymentsTotal = currentRows
      .filter(row => row.isRegistered)
      .reduce((sum, row) => {
        return sum + (parseInt(row.total) || 0);
      }, 0);
  
    console.log('Calculate Total - Nuevos:', newPaymentsTotal);
    console.log('Calculate Total - Registrados:', registeredPaymentsTotal);
  
    onUpdateTotal(newPaymentsTotal, registeredPaymentsTotal);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    calculateTotal(updatedRows);
  };

  useImperativeHandle(ref, () => ({
    handleAddRow: () => {
      setRows([...rows, {}]);
    },
    handleSubmitPayments: async () => {
      try {
        const validRows = rows.filter(row => !row.isRegistered && row.trabajador && row.fecha);

        if (validRows.length === 0) {
          alert('Por favor, complete al menos una fila con trabajador y fecha');
          return;
        }

        const promises = validRows.map(row => {
          const paymentData = {
            employee_id: row.trabajador,
            project_id: projectId,
            quote_number: quoteNumber,
            pago_dia: row.pagoDia || 0,
            colacion: row.colacion || 0,
            gestion: row.gestion || 0,
            extra: row.extra || 0,
            trabajo_fecha: row.fecha
          };
          return axios.post('http://localhost:5000/api/flujo/payments', paymentData);
        });

        await Promise.all(promises);
        await fetchProjectPayments();
        alert('Pagos registrados exitosamente');
      } catch (error) {
        console.error('Error al registrar los pagos:', error);
        alert(`Error al registrar los pagos: ${error.message}`);
      }
    }
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto rounded-t-lg border border-gray-200 bg-white">
        <table className="min-w-full">
          <thead className="bg-red-800">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Trabajador</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Pago Día</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Colación</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Gestión</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Extra</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, index) => (
              <tr key={index} className={`hover:bg-gray-50 transition-colors duration-200 ${row.isRegistered ? 'bg-gray-50' : ''}`}>
                <td className="py-4 px-6">
                  {row.isRegistered ? (
                    <span className="text-gray-700">{row.employee_name}</span>
                  ) : (
                    <div className="relative group">
                      <select
                        name="trabajador"
                        value={row.trabajador || ''}
                        onChange={(e) => handleInputChange(index, e)}
                        className="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg
                                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                                 focus:bg-red-50
                                 appearance-none cursor-pointer
                                 transition-all duration-200 ease-in-out
                                 hover:border-red-400
                                 shadow-sm"
                      >
                        <option value="" disabled>Responsable</option>
                        {empleados.map((empleado) => (
                          <option key={empleado.employee_id} value={empleado.employee_id}>
                            {empleado.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  {row.isRegistered ? (
                    <span>{new Date(row.fecha).toLocaleDateString()}</span>
                  ) : (
                    <input
                      type="date"
                      name="fecha"
                      value={row.fecha || ''}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-full bg-transparent text-gray-700 focus:outline-none border-gray-300 rounded-md"
                    />
                  )}
                </td>
                {['pagoDia', 'colacion', 'gestion', 'extra', 'total'].map((field) => (
                  <td key={field} className="py-4 px-6">
                    {row.isRegistered ? (
                      <span>{formatCLP(row[field])}</span>
                    ) : (
                      <input
                        type="text"
                        name={field}
                        value={formatCLP(row[field])}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full bg-transparent text-gray-700 focus:outline-none border-gray-300 rounded-md"
                        placeholder="\$0"
                        readOnly={field === 'total'}
                      />
                    )}
                  </td>
                ))}
                <td className="py-4 px-6 text-center">
                  {!row.isRegistered && (
                    <button
                      onClick={() => handleDeleteRow(index)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

ListaTrabajador.displayName = 'ListaTrabajador';

export default ListaTrabajador;