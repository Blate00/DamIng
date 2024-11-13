const pool = require('../config');
const getManoObra = async (quoteNumber) => {
    const query = `
      WITH total_mano_obra AS (
        SELECT 
          (subtotal - gestion_amount) as valor_total
        FROM description_budgets 
        WHERE quote_number = \$1
        ORDER BY budget_date DESC 
        LIMIT 1
      ),
      total_recibido AS (
        SELECT COALESCE(SUM(saldo_recibido), 0) as valor_recibido
        FROM mano_obra 
        WHERE quote_number = \$1
      )
      SELECT 
        mo.*,
        tp.nombre_pago as medio_pago,
        (SELECT valor_total FROM total_mano_obra) as total_mano_obra,
        (SELECT valor_recibido FROM total_recibido) as total_recibido,
        ((SELECT valor_total FROM total_mano_obra) - 
         (SELECT valor_recibido FROM total_recibido)) as saldo_actual
      FROM mano_obra mo
      LEFT JOIN tipo_pago tp ON mo.tipo_pago_id = tp.tipo_pago_id
      WHERE mo.quote_number = \$1 
      ORDER BY mo.fecha_actualizacion DESC
    `;
    const { rows } = await pool.query(query, [quoteNumber]);
    
    // Si no hay registros pero existe un presupuesto, devolver los valores iniciales
    if (rows.length === 0) {
      const initialQuery = `
        SELECT 
          (subtotal - gestion_amount) as total_mano_obra,
          0 as total_recibido,
          (subtotal - gestion_amount) as saldo_actual
        FROM description_budgets 
        WHERE quote_number = \$1
        ORDER BY budget_date DESC 
        LIMIT 1
      `;
      const { rows: initialRows } = await pool.query(initialQuery, [quoteNumber]);
      return initialRows;
    }
    
    return rows;
  };
  const createManoObra = async (manoObra) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
      // Obtener el total del presupuesto (subtotal - gestion_amount)
      const { rows: [presupuesto] } = await client.query(`
        SELECT 
          (subtotal - gestion_amount) as total_mano_obra
        FROM description_budgets 
        WHERE quote_number = \$1
        ORDER BY budget_date DESC 
        LIMIT 1
      `, [manoObra.quote_number]);
  
      // Obtener el total de pagos previos
      const { rows: [totalPagosPrevios] } = await client.query(`
        SELECT COALESCE(SUM(saldo_recibido), 0) as total 
        FROM mano_obra 
        WHERE quote_number = \$1
      `, [manoObra.quote_number]);
  
      const saldoRecibido = parseFloat(manoObra.saldo_recibido);
      const totalRecibido = saldoRecibido + parseFloat(totalPagosPrevios.total || 0);
      const saldoActual = parseFloat(presupuesto?.total_mano_obra || 0) - totalRecibido;
  
      const query = `
        INSERT INTO mano_obra (
          quote_number, saldo_recibido, saldo_actual, fecha_actualizacion, tipo_pago_id
        )
        VALUES (\$1, \$2, \$3, CURRENT_TIMESTAMP, \$4)
        RETURNING *, 
          \$5::numeric as total_mano_obra,
          \$6::numeric as total_recibido
      `;
      
      const values = [
        manoObra.quote_number,
        saldoRecibido,
        saldoActual,
        manoObra.tipo_pago_id,
        presupuesto?.total_mano_obra,
        totalRecibido
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
    getManoObra,
    createManoObra
  };