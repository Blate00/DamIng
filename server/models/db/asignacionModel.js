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
      ), 0) as total_rendiciones,
      (
        SELECT SUM(saldo_recibido) 
        FROM asignacion 
        WHERE quote_number = a.quote_number
      ) as total_asignaciones
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

    // Obtener el total de rendiciones
    const { rows: [totalRendiciones] } = await client.query(`
      SELECT COALESCE(SUM(total), 0) as total 
      FROM rendiciones 
      WHERE quote_number = \$1
    `, [asignacion.quote_number]);

    // Obtener el total de asignaciones previas
    const { rows: [totalAsignacionesPrevias] } = await client.query(`
      SELECT COALESCE(SUM(saldo_recibido), 0) as total 
      FROM asignacion 
      WHERE quote_number = \$1
    `, [asignacion.quote_number]);

    const saldoRecibido = parseFloat(asignacion.saldo_recibido);
    const totalAsignaciones = saldoRecibido + parseFloat(totalAsignacionesPrevias.total || 0);
    const saldoActual = totalAsignaciones - parseFloat(totalRendiciones.total || 0);

    const query = `
      INSERT INTO asignacion (
        quote_number, saldo_recibido, saldo_actual, fecha_actualizacion
      )
      VALUES (\$1, \$2, \$3, CURRENT_TIMESTAMP)
      RETURNING *, 
        \$4::numeric as total_asignaciones,
        \$5::numeric as total_rendiciones
    `;
    
    const values = [
      asignacion.quote_number,
      saldoRecibido,
      saldoActual,
      totalAsignaciones,
      totalRendiciones.total
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