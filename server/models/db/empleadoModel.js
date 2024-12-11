const pool = require('../config');

const addEmpleado = async (empleadoData) => {
  const dbClient = await pool.connect();
  try {
    const result = await dbClient.query(
      'INSERT INTO employees (name, email, phone_number, banco_id, account_number, tipo_cuenta_id) VALUES (\$1, \$2, \$3, \$4, \$5, \$6) RETURNING *',
      [empleadoData.name, empleadoData.email, empleadoData.phone_number, empleadoData.banco_id, empleadoData.account_number, empleadoData.tipo_cuenta_id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  } finally {
    dbClient.release();
  }
};

const getEmpleados = async () => {
  const { rows } = await pool.query('SELECT * FROM employees');
  return rows;
};

const deleteEmpleado = async (empleadoId) => {
  await pool.query('DELETE FROM employees WHERE employee_id = \$1', [empleadoId]);
};


// models/db/empleadoModel.js  

const getEmpleadoPayments = async (employeeId) => {  
  const query = `  
    SELECT   
      ep.*,  
      p.project_name,  
      TO_CHAR(ep.created_at::date, 'DD-MM-YYYY') as fecha_pago,  
      TO_CHAR(ep.trabajo_fecha, 'DD-MM-YYYY') as fecha_trabajo  
    FROM employee_payments ep  
    JOIN projects p ON ep.project_id = p.project_id  
    WHERE ep.employee_id = \$1  
    ORDER BY ep.created_at DESC  
  `;  

  const { rows } = await pool.query(query, [employeeId]);  
  return rows;  
};  

const getEmpleadoPaymentsByPaymentDate = async (employeeId, fechaPago) => {  
  const query = `  
    SELECT   
      ep.*,  
      p.project_name,  
      TO_CHAR(ep.created_at::date, 'DD-MM-YYYY') as fecha_pago,  
      TO_CHAR(ep.trabajo_fecha, 'DD-MM-YYYY') as fecha_trabajo  
    FROM employee_payments ep  
    JOIN projects p ON ep.project_id = p.project_id  
    WHERE ep.employee_id = \$1   
    AND ep.created_at::date = \$2::date  
  `;  

  const { rows } = await pool.query(query, [employeeId, fechaPago]);  
  return rows;  
};  


module.exports = {
  getEmpleados,
  addEmpleado,
  deleteEmpleado,  getEmpleadoPayments,  
  getEmpleadoPaymentsByPaymentDate  
};