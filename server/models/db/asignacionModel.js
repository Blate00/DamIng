const pool = require('../config');

const getAsignaciones = async (quoteNumber) => {
  const query = `
    SELECT 
      a.*,
      tp.nombre_pago as medio_pago,
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
    LEFT JOIN tipo_pago tp ON a.tipo_pago_id = tp.tipo_pago_id
    WHERE a.quote_number = \$1 
    ORDER BY a.fecha_actualizacion DESC
  `;
  const { rows } = await pool.query(query, [quoteNumber]);
  return rows || [];
};

const getTiposPago = async () => {
  const query = 'SELECT * FROM tipo_pago ORDER BY nombre_pago';
  const { rows } = await pool.query(query);
  return rows;
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
        quote_number, saldo_recibido, saldo_actual, fecha_actualizacion, tipo_pago_id
      )
      VALUES (\$1, \$2, \$3, CURRENT_TIMESTAMP, \$4)
      RETURNING *, 
        \$5::numeric as total_asignaciones,
        \$6::numeric as total_rendiciones
    `;
    
    const values = [
      asignacion.quote_number,
      saldoRecibido,
      saldoActual,
      asignacion.tipo_pago_id,
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
  createAsignacion,
  getTiposPago
};