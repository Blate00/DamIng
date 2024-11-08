const pool = require('../config');

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

module.exports = {
  getAsignaciones,
  createAsignacion
};