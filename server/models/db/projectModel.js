const pool = require('../config');

// Función para obtener todos los proyectos
const getAllProjects = async () => {
  const { rows } = await pool.query('SELECT * FROM projects');
  return rows;
};

// Nueva función para obtener proyectos filtrados por client_id
const getProjectsByClientId = async (clientId) => {
  const { rows } = await pool.query('SELECT * FROM projects WHERE client_id = \$1', [clientId]);
  return rows;
};
const createProject = async ({ clientId, projectName, quoteNumber, status, startDate, endDate }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
  
    // Insertar el nuevo proyecto
    const { rows: [newProject] } = await client.query(
      `INSERT INTO projects 
       (client_id, project_name, quote_number, status, start_date, end_date) 
       VALUES (\$1, \$2, \$3, \$4, \$5, \$6) 
       RETURNING *`,
      [clientId, projectName, quoteNumber, status, startDate, endDate]
    );
  
    // Actualizar el contador de proyectos del cliente
    await client.query(
      'UPDATE clients SET project_count = project_count + 1 WHERE client_id = \$1',
      [clientId]
    );
  
    await client.query('COMMIT');
    return newProject;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  };
module.exports = {
  getAllProjects, // Exportar la función para obtener todos los proyectos
  getProjectsByClientId, // Exportar la nueva función para obtener proyectos por client_id
  createProject
};