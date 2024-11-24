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

  
const getClientById = async (clientId) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM clients WHERE client_id = \$1',
      [clientId]
    );
    return rows[0];
  } catch (error) {
    throw new Error(`Error al obtener cliente: ${error.message}`);
  }
  };
  
  const deleteClientAndProjects = async (clientId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
  
    // Eliminar registros relacionados en documents
    await client.query(`
      DELETE FROM documents 
      WHERE project_id IN (
        SELECT project_id FROM projects WHERE client_id = \$1
      )`, [clientId]);
  
    // Eliminar registros relacionados en description_budgets
    await client.query(`
      DELETE FROM description_budgets 
      WHERE project_id IN (
        SELECT project_id FROM projects WHERE client_id = \$1
      )`, [clientId]);
  
    // Eliminar registros relacionados en rendiciones
    await client.query(`
      DELETE FROM rendiciones 
      WHERE project_id IN (
        SELECT project_id FROM projects WHERE client_id = \$1
      )`, [clientId]);
  
    // Eliminar registros relacionados en lista_materiales
    await client.query(`
      DELETE FROM lista_materiales 
      WHERE project_id IN (
        SELECT project_id FROM projects WHERE client_id = \$1
      )`, [clientId]);
  
    // Eliminar registros relacionados en tasks
    await client.query(`
      DELETE FROM tasks 
      WHERE project_id IN (
        SELECT project_id FROM projects WHERE client_id = \$1
      )`, [clientId]);
  
    // Eliminar proyectos del cliente
    await client.query(
      'DELETE FROM projects WHERE client_id = \$1',
      [clientId]
    );
  
    // Finalmente eliminar el cliente
    await client.query(
      'DELETE FROM clients WHERE client_id = \$1',
      [clientId]
    );
  
    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  };
  
  const getClients = async () => {
  try {
    const { rows } = await pool.query('SELECT * FROM clients');
    return rows;
  } catch (error) {
    throw new Error(`Error al obtener clientes: ${error.message}`);
  }
  };
  

module.exports = {
  getClients,
  addClientWithProject,
  getClientById,
  deleteClientAndProjects,
  getClients
};