const pool = require('../config');

const getClients = async () => {
  const { rows } = await pool.query('SELECT * FROM clients');
  return rows;
};
const addClient = async (client) => {
  const { name, email, phone_number } = client;
  const { rows } = await pool.query(
    'INSERT INTO clients (name, email, phone_number, project_count) VALUES (\$1, \$2, \$3, 1) RETURNING *',
    [name, email, phone_number]
  );
  return rows[0];
};

const deleteClient = async (clientId) => {
  await pool.query('DELETE FROM clients WHERE client_id = \$1', [clientId]);
};

const addProject = async (project) => {
  const { client_id, project_name, quote_number, status, start_date, end_date } = project;
  await pool.query(
    'INSERT INTO projects (client_id, project_name, quote_number, status, start_date, end_date) VALUES (\$1, \$2, \$3, \$4, \$5, \$6)',
    [client_id, project_name, quote_number, status, start_date, end_date]
  );
};

const getProjectsByClientId = async (clientId) => {
  const { rows } = await pool.query('SELECT project_id, quote_number FROM projects WHERE client_id = \$1', [clientId]);
  return rows;
};

const deleteProjectsByClientId = async (clientId) => {
  await pool.query('DELETE FROM projects WHERE client_id = \$1', [clientId]);
};

module.exports = {
  getClients,
  addClient,
  deleteClient,
  addProject,
  getProjectsByClientId,
  deleteProjectsByClientId,
};