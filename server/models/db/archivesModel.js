// models/db/archivesModel.js
const pool = require('../config');

const getDocumentsByProjectId = async (projectId) => {
    const query = `
      SELECT d.*, td.nombre_documento
      FROM documents d
      LEFT JOIN tipo_document td ON d.tipo_document_id = td.id
      WHERE d.project_id = \$1
    `;
    const { rows } = await pool.query(query, [projectId]);
    return rows;
  };

const getProjectNameById = async (projectId) => {
  const query = `
    SELECT project_name
    FROM projects
    WHERE project_id = \$1
  `;
  const { rows } = await pool.query(query, [projectId]);
  return rows[0];
};

module.exports = {
  getDocumentsByProjectId,
  getProjectNameById,
};