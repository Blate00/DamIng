const pool = require('../config');

const getRendiciones = async (projectId) => {
  try {
    const query = `
      SELECT r.*, p.nombre as proveedor_nombre 
      FROM rendiciones r
      LEFT JOIN proveedores p ON r.proveedor_id = p.proveedor_id
      WHERE r.project_id = \$1
      ORDER BY r.fecha DESC
    `;
    const { rows } = await pool.query(query, [projectId]);
    return rows;
  } catch (error) {
    console.error('Error en getRendiciones:', error);
    throw error;
  }
};

const createRendicion = async (rendicion) => {
  try {
    // Primero verificamos que el project_id y quote_number existan en la tabla projects
    const checkProjectQuery = `
      SELECT * FROM projects 
      WHERE project_id = \$1 AND quote_number = \$2
    `;
    const projectCheck = await pool.query(checkProjectQuery, [
      rendicion.project_id,
      rendicion.quote_number
    ]);

    if (projectCheck.rows.length === 0) {
      throw new Error('El proyecto o número de cotización no existe');
    }

    const query = `
      INSERT INTO rendiciones (
        project_id, quote_number, fecha, detalle, 
        folio, proveedor_id, documento, total
      )
      VALUES (\$1, \$2, COALESCE(\$3, CURRENT_DATE), \$4, \$5, \$6, \$7, \$8)
      RETURNING *, (
        SELECT nombre FROM proveedores 
        WHERE proveedor_id = \$6
      ) as proveedor_nombre
    `;
    
    const values = [
      rendicion.project_id,
      rendicion.quote_number,
      rendicion.fecha || null,
      rendicion.detalle,
      rendicion.folio,
      rendicion.proveedor_id,
      rendicion.documento,
      parseFloat(rendicion.total)
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error en createRendicion:', error);
    throw error;
  }
};

const updateRendicion = async (rendicionId, data) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Actualiza la rendición
    const queryRendicion = `
      UPDATE rendiciones
      SET
        fecha = \$1,
        detalle = \$2,
        folio = \$3,
        proveedor_id = \$4,
        documento = \$5,
        total = \$6
      WHERE rendicion_id = \$7
    `;
    const valuesRendicion = [data.fecha, data.detalle, data.folio, data.proveedor_id, data.documento, data.total, rendicionId];
    
    await client.query(queryRendicion, valuesRendicion);

    // Actualiza el total en detalle_rendicion
    const queryDetalleRendicion = `
      UPDATE detalle_rendicion
      SET total_rendicion = (SELECT COALESCE(SUM(total), 0) FROM rendiciones WHERE quote_number = \$1),
          fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE quote_number = \$1
    `;
    await client.query(queryDetalleRendicion, [data.quote_number]);

    // Actualiza el saldo actual en asignacion
    const queryAsignacion = `
      UPDATE asignacion
      SET saldo_actual = saldo_recibido - (SELECT COALESCE(SUM(total), 0) FROM rendiciones WHERE quote_number = \$1),
          fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE quote_number = \$1
    `;
    await client.query(queryAsignacion, [data.quote_number]);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error; // Lanza el error para manejarlo en el controlador
  } finally {
    client.release();
  }
};

const deleteRendicion = async (rendicionId) => {
  try {
    const query = 'DELETE FROM rendiciones WHERE rendicion_id = \$1 RETURNING *';
    const { rows } = await pool.query(query, [rendicionId]);
    
    if (rows.length === 0) {
      throw new Error('Rendición no encontrada');
    }
    
    return rows[0];
  } catch (error) {
    console.error('Error en deleteRendicion:', error);
    throw error;
  }
};

const getTotalRendiciones = async (quoteNumber) => {
  try {
    const query = `
      SELECT COALESCE(SUM(total), 0) as total 
      FROM rendiciones 
      WHERE quote_number = \$1
    `;
    const { rows } = await pool.query(query, [quoteNumber]);
    return parseFloat(rows[0].total || 0);
  } catch (error) {
    console.error('Error en getTotalRendiciones:', error);
    throw error;
  }
};

const getProveedores = async () => {
  try {
    const query = 'SELECT * FROM proveedores ORDER BY nombre';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error en getProveedores:', error);
    throw error;
  }
};

module.exports = {
  getRendiciones,
  createRendicion,
  updateRendicion,
  deleteRendicion,
  getTotalRendiciones,
  getProveedores
};