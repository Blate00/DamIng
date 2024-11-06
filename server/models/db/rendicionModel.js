// rendicionModel.js
const pool = require('../config');

const getRendiciones = async (projectId) => {
  const query = `
    SELECT r.*, p.nombre as proveedor_nombre 
    FROM rendiciones r
    LEFT JOIN proveedores p ON r.proveedor_id = p.proveedor_id
    WHERE r.project_id = \$1
    ORDER BY r.fecha DESC
  `;
  const { rows } = await pool.query(query, [projectId]);
  return rows;
};

const createRendicion = async (rendicion) => {
  const query = `
    INSERT INTO rendiciones (
      project_id, quote_number, fecha, detalle, 
      folio, proveedor_id, documento, total
    )
    VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8)
    RETURNING *, (
      SELECT nombre FROM proveedores 
      WHERE proveedor_id = \$6
    ) as proveedor_nombre
  `;
  const values = [
    rendicion.project_id,
    rendicion.quote_number,
    rendicion.fecha,
    rendicion.detalle,
    rendicion.folio,
    rendicion.proveedor_id,
    rendicion.documento,
    parseFloat(rendicion.total)
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const updateRendicion = async (rendicionId, data) => {
  const query = `
    UPDATE rendiciones
    SET detalle = \$1, 
        folio = \$2, 
        proveedor_id = \$3,
        documento = \$4, 
        total = \$5,
        fecha_actualizacion = CURRENT_TIMESTAMP
    WHERE rendicion_id = \$6
    RETURNING *, (
      SELECT nombre FROM proveedores 
      WHERE proveedor_id = \$3
    ) as proveedor_nombre
  `;
  const values = [
    data.detalle,
    data.folio,
    data.proveedor_id,
    data.documento,
    parseFloat(data.total),
    rendicionId
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteRendicion = async (rendicionId) => {
  const query = 'DELETE FROM rendiciones WHERE rendicion_id = \$1 RETURNING *';
  const { rows } = await pool.query(query, [rendicionId]);
  return rows[0];
};

const getTotalRendiciones = async (quoteNumber) => {
  const query = `
    SELECT COALESCE(SUM(total), 0) as total 
    FROM rendiciones 
    WHERE quote_number = \$1
  `;
  const { rows } = await pool.query(query, [quoteNumber]);
  return parseFloat(rows[0].total || 0);
};

const getAsignaciones = async (quoteNumber) => {
  const query = `
    SELECT 
      a.*,
      COALESCE((
        SELECT SUM(total) 
        FROM rendiciones 
        WHERE quote_number = a.quote_number
        AND fecha <= a.fecha_actualizacion
      ), 0) as total_rendiciones
    FROM asignacion a
    WHERE a.quote_number = \$1 
    ORDER BY a.fecha_actualizacion DESC
  `;
  const { rows } = await pool.query(query, [quoteNumber]);
  return rows || [];
};

const createAsignacion = async (asignacion) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: [totalRendiciones] } = await client.query(`
      SELECT COALESCE(SUM(total), 0) as total 
      FROM rendiciones 
      WHERE quote_number = \$1
    `, [asignacion.quote_number]);

    const saldoRecibido = parseFloat(asignacion.saldo_recibido);
    const saldoActual = saldoRecibido - parseFloat(totalRendiciones.total || 0);

    const query = `
      INSERT INTO asignacion (
        quote_number, saldo_recibido, saldo_actual
      )
      VALUES (\$1, \$2, \$3)
      RETURNING *
    `;
    const values = [
      asignacion.quote_number,
      saldoRecibido,
      saldoActual
    ];

    const { rows } = await client.query(query, values);
    await client.query('COMMIT');
    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getProveedores = async () => {
  const query = 'SELECT * FROM proveedores ORDER BY nombre';
  const { rows } = await pool.query(query);
  return rows || [];
};

module.exports = {
  getRendiciones,
  createRendicion,
  updateRendicion,
  deleteRendicion,
  getTotalRendiciones,
  getAsignaciones,
  createAsignacion,
  getProveedores
};