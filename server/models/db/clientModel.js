const pool = require('../db/config');

async function addClient(clientName, email, phone) {
  try {
    const result = await pool.query(
      'INSERT INTO clients (name, email, phone_number) VALUES (\$1, \$2, \$3) RETURNING *',
      [clientName, email, phone]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = { addClient };