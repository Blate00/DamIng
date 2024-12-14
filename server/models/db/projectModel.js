const pool = require('../config');

const getAllProjects = async () => {
  const { rows } = await pool.query('SELECT * FROM projects');
  return rows;
};

const getProjectsByClientId = async (clientId) => {
  const { rows } = await pool.query('SELECT * FROM projects WHERE client_id = \$1', [clientId]);
  return rows;
};

const createProject = async ({ clientId, projectName, quoteNumber, status }) => {
  const client = await pool.connect();

  console.log('Datos recibidos en el modelo:', {
    clientId,
    projectName,
    quoteNumber,
    status
  });

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO projects (client_id, project_name, quote_number, status)
       VALUES (\$1, \$2, \$3, \$4)
       RETURNING *`,
      [clientId, projectName, quoteNumber, status]
    );

    await client.query(
      'UPDATE clients SET project_count = project_count + 1 WHERE client_id = \$1',
      [clientId]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const updateProjectStatus = async (projectId, status, startDate, endDate) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let query = `
    UPDATE projects 
    SET status = \$1
  `;
    const values = [status];
    let valueIndex = 2;

    if (startDate) {
      query += `, start_date = ${valueIndex}`;
      values.push(startDate);
      valueIndex++;
    }

    if (endDate) {
      query += `, end_date = ${valueIndex}`;
      values.push(endDate);
      valueIndex++;
    }

    query += ` WHERE project_id = ${valueIndex} RETURNING *`;
    values.push(projectId);

    const result = await client.query(query, values);

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
module.exports = {
  getAllProjects,
  getProjectsByClientId,
  createProject,
  updateProjectStatus
};