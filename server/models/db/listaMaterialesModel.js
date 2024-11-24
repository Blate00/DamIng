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
  
    // Insertar nueva lista
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
    console.log(`Buscando listas para el projectId: ${projectId}`); // Agregar log
  
    const query = `
      SELECT 
        lm.lista_id,
        lm.project_id,
        lm.quote_number,
        lm.total_materiales,
        lm.total_dinero,
        lm.fecha_creacion,
        p.project_name,
        dlm.detalle_id,
        dlm.material_id,
        dlm.cantidad,
        dlm.precio_unitario,
        dlm.subtotal
      FROM lista_materiales lm
      JOIN projects p ON lm.project_id = p.project_id
      LEFT JOIN detalle_lista_materiales dlm ON lm.lista_id = dlm.lista_id
      WHERE lm.project_id = \$1
      ORDER BY lm.fecha_creacion DESC;
    `;
  
    const result = await client.query(query, [projectId]);
  
    console.log(`Resultados de la consulta: ${JSON.stringify(result.rows)}`); // Agregar log
  
    if (result.rows.length === 0) {
      return null; // No se encontró ninguna lista para el proyecto
    }
  
    // Restructurar los datos
    const listas = result.rows.reduce((acc, row) => {
      let lista = acc.find(l => l.lista_id === row.lista_id);
      if (!lista) {
        lista = {
          lista_id: row.lista_id,
          project_id: row.project_id,
          quote_number: row.quote_number,
          total_materiales: row.total_materiales,
          total_dinero: row.total_dinero,
          fecha_creacion: row.fecha_creacion,
          project_name: row.project_name,
          detalles: []
        };
        acc.push(lista);
      }
      if (row.detalle_id) {
        lista.detalles.push({
          detalle_id: row.detalle_id,
          material_id: row.material_id,
          cantidad: row.cantidad,
          precio_unitario: row.precio_unitario,
          subtotal: row.subtotal
        });
      }
      return acc;
    }, []);
  
    return listas;
  
  } catch (error) {
    console.error('Error en getListaByProject:', error);
    throw error;
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