const pool = require('../config');

const createLista = async (projectId, quoteNumber, items) => {
  const client = await pool.connect();
  try {
      await client.query('BEGIN');

      // Validar items
      if (!items.every(item => 
          item.material_id && 
          item.cantidad && 
          item.precio_unitario
      )) {
          throw new Error('Datos de items incompletos');
      }

      const totalMateriales = items.length;
      const totalDinero = items.reduce((sum, item) => 
          sum + (parseFloat(item.cantidad) * parseFloat(item.precio_unitario)), 0
      );

      // Insertar cabecera
      const listaResult = await client.query(
          `INSERT INTO lista_materiales 
          (project_id, quote_number, total_materiales, total_dinero) 
          VALUES (\$1, \$2, \$3, \$4) 
          RETURNING *`,
          [projectId, quoteNumber, totalMateriales, totalDinero]
      );

      // Insertar detalles
      for (const item of items) {
          await client.query(
              `INSERT INTO detalle_lista_materiales 
              (lista_id, material_id, cantidad, precio_unitario, subtotal) 
              VALUES (\$1, \$2, \$3, \$4, \$5)`,
              [
                  listaResult.rows[0].lista_id,
                  item.material_id,
                  item.cantidad,
                  item.precio_unitario,
                  parseFloat(item.cantidad) * parseFloat(item.precio_unitario)
              ]
          );
      }

      await client.query('COMMIT');
      return listaResult.rows[0];
  } catch (error) {
      await client.query('ROLLBACK');
      throw error;
  } finally {
      client.release();
  }
};
const getAllListas = async () => {
const result = await pool.query(
  `SELECT l.*, p.project_name 
   FROM lista_materiales l
   JOIN projects p ON l.project_id = p.project_id
   ORDER BY l.fecha_creacion DESC`
);
return result.rows;
};

const searchMaterials = async (searchTerm) => {
const result = await pool.query(
  `SELECT * FROM materiales 
   WHERE LOWER(description) LIKE LOWER(\$1) 
   OR LOWER(category) LIKE LOWER(\$1)
   ORDER BY category, description
   LIMIT 10`,
  [`%${searchTerm}%`]
);
return result.rows;
};

const getListaByProject = async (projectId) => {
const client = await pool.connect();
try {
  const listaResult = await client.query(
    `SELECT l.*, p.project_name 
     FROM lista_materiales l
     JOIN projects p ON l.project_id = p.project_id
     WHERE l.project_id = \$1
     ORDER BY l.fecha_creacion DESC
     LIMIT 1`,
    [projectId]
  );

  if (listaResult.rows.length === 0) {
    return null;
  }

  const detallesResult = await client.query(
    `SELECT d.*, m.description, m.category, m.current_value
     FROM detalle_lista_materiales d
     JOIN materiales m ON d.material_id = m.material_id
     WHERE d.lista_id = \$1`,
    [listaResult.rows[0].lista_id]
  );

  return {
    ...listaResult.rows[0],
    detalles: detallesResult.rows
  };
} finally {
  client.release();
}
};

const getListaById = async (listaId) => {
const client = await pool.connect();
try {
  const listaResult = await client.query(
    `SELECT l.*, p.project_name 
     FROM lista_materiales l
     JOIN projects p ON l.project_id = p.project_id
     WHERE l.lista_id = \$1`,
    [listaId]
  );

  const detallesResult = await client.query(
    `SELECT d.*, m.description, m.category
     FROM detalle_lista_materiales d
     JOIN materiales m ON d.material_id = m.material_id
     WHERE d.lista_id = \$1`,
    [listaId]
  );

  return {
    ...listaResult.rows[0],
    detalles: detallesResult.rows
  };
} finally {
  client.release();
}
};

const updateLista = async (listaId, items) => {
const client = await pool.connect();
try {
  await client.query('BEGIN');

  const totalMateriales = items.length;
  const totalDinero = items.reduce((sum, item) => 
    sum + (item.cantidad * item.precio_unitario), 0);

  await client.query(
    `UPDATE lista_materiales 
     SET total_materiales = \$1, total_dinero = \$2
     WHERE lista_id = \$3`,
    [totalMateriales, totalDinero, listaId]
  );

  await client.query(
    'DELETE FROM detalle_lista_materiales WHERE lista_id = \$1',
    [listaId]
  );

  for (const item of items) {
    await client.query(
      `INSERT INTO detalle_lista_materiales 
      (lista_id, material_id, cantidad, precio_unitario, subtotal) 
      VALUES (\$1, \$2, \$3, \$4, \$5)`,
      [
        listaId,
        item.material_id,
        item.cantidad,
        item.precio_unitario,
        item.cantidad * item.precio_unitario
      ]
    );
  }

  await client.query('COMMIT');
  return await getListaById(listaId);
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
};

const deleteLista = async (listaId) => {
const result = await pool.query(
  'DELETE FROM lista_materiales WHERE lista_id = \$1 RETURNING *',
  [listaId]
);
return result.rows[0];
};

module.exports = {
createLista,
getAllListas,
searchMaterials,
getListaByProject,
getListaById,
updateLista,
deleteLista
};