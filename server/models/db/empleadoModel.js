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

module.exports = {
  getEmpleados,
  addEmpleado,
  deleteEmpleado,
};