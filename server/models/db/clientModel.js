const pool = require('../config');

const addClientWithProject = async (clientData) => {
  const dbClient = await pool.connect();
  try {
    await dbClient.query('BEGIN');

    // Insertar el cliente
    const clientResult = await dbClient.query(
      'INSERT INTO clients (name, email, phone_number) VALUES (\$1, \$2, \$3) RETURNING *',
      [clientData.name, clientData.email, clientData.phone_number]
    );
    
    const newClient = clientResult.rows[0];

    // Insertar el proyecto si se proporcionó un nombre
    if (clientData.projectName) {
      await dbClient.query(
        'INSERT INTO projects (client_id, project_name, status) VALUES (\$1, \$2, \$3)',
        [newClient.client_id, clientData.projectName, 'No Iniciado']
      );
    }

    await dbClient.query('COMMIT');
    return newClient;
  } catch (error) {
    await dbClient.query('ROLLBACK');
    throw error;
  } finally {
    dbClient.release();
  }
};

const getClients = async () => {
  const { rows } = await pool.query('SELECT * FROM clients');
  return rows;
};

const deleteClient = async (clientId) => {
  await pool.query('DELETE FROM clients WHERE client_id = \$1', [clientId]);
};
const getClientById = async (clientId) => {
  try {
    console.log('Ejecutando consulta para cliente ID:', clientId);
    const { rows } = await pool.query(
      'SELECT * FROM clients WHERE client_id = \$1',
      [clientId]
    );
    console.log('Resultado de la consulta:', rows);
    return rows[0];
  } catch (error) {
    console.error('Error en getClientById:', error);
    throw error;
  }
};

module.exports = {
  getClients,
  addClientWithProject,
  deleteClient,
};