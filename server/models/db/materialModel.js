const pool = require('../config');

const addMaterial = async (materialData) => {
  const { category, description, current_value } = materialData;
  const result = await pool.query(
    `INSERT INTO materiales (
      category, 
      description, 
      current_value, 
      updated_value, 
      entry_date,
      update_counter
    ) VALUES (\$1, \$2, \$3, \$3, CURRENT_DATE, 0) 
    RETURNING *`,
    [category, description, current_value]
  );
  return result.rows[0];
};

const getMaterials = async () => {
  const result = await pool.query(
    'SELECT * FROM materiales ORDER BY entry_date DESC'
  );
  return result.rows;
};

const updateMaterialValue = async (materialId, newValue) => {
  const result = await pool.query(
    `UPDATE materiales 
    SET current_value = \$1,
        updated_value = current_value,
        last_update_date = CURRENT_DATE,
        update_counter = update_counter + 1
    WHERE material_id = \$2 
    RETURNING *`,
    [newValue, materialId]
  );
  return result.rows[0];
};

const getMaterialById = async (materialId) => {
  const result = await pool.query(
    'SELECT * FROM materiales WHERE material_id = \$1',
    [materialId]
  );
  return result.rows[0];
};

const deleteMaterial = async (materialId) => {
  const result = await pool.query(
    'DELETE FROM materiales WHERE material_id = \$1 RETURNING *',
    [materialId]
  );
  return result.rows[0];
};

// Función adicional para filtrar por categoría
const getMaterialsByCategory = async (category) => {
  const result = await pool.query(
    'SELECT * FROM materiales WHERE category = \$1 ORDER BY entry_date DESC',
    [category]
  );
  return result.rows;
};

module.exports = {
  addMaterial,
  getMaterials,
  getMaterialById,
  updateMaterialValue,
  deleteMaterial,
  getMaterialsByCategory
};