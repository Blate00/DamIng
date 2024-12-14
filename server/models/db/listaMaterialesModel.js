const pool = require('../config');  
  
const addMaterialToList = async (listData) => {  
  const { project_id, quote_number, material_id, quantity, unit_value } = listData;  
  const result = await pool.query(  
    `INSERT INTO material_lists   
    (project_id, quote_number, material_id, quantity, unit_value)   
    VALUES (\$1, \$2, \$3, \$4, \$5)   
    RETURNING *`,  
    [project_id, quote_number, material_id, quantity, unit_value]  
  );  
  return result.rows[0];  
};   
// Obtener lista de materiales por proyecto  
const getMaterialListByProject = async (project_id) => {  
  const result = await pool.query(  
    `SELECT   
      ml.*,  
      m.category,  
      m.description,  
      m.current_value  
    FROM material_lists ml  
    JOIN materiales m ON ml.material_id = m.material_id  
    WHERE ml.project_id = \$1  
    ORDER BY ml.list_id DESC`,  
    [project_id]  
  );  
  return result.rows;  
};  
  
// Obtener lista de materiales por número de cotización  
const getMaterialListByQuote = async (quote_number) => {  
  const result = await pool.query(  
    `SELECT   
      ml.*,  
      m.category,  
      m.description,  
      m.current_value  
    FROM material_lists ml  
    JOIN materiales m ON ml.material_id = m.material_id  
    WHERE ml.quote_number = \$1  
    ORDER BY ml.list_id DESC`,  
    [quote_number]  
  );  
  return result.rows;  
};  
  
// Actualizar cantidad de un material en la lista  
const updateMaterialQuantity = async (list_id, quantity) => {  
  const result = await pool.query(  
    `UPDATE material_lists   
    SET quantity = \$2  
    WHERE list_id = \$1   
    RETURNING *`,  
    [list_id, quantity]  
  );  
  return result.rows[0];  
};  
  
// Eliminar un material de la lista  
const removeMaterialFromList = async (list_id) => {  
  const result = await pool.query(  
    'DELETE FROM material_lists WHERE list_id = \$1 RETURNING *',  
    [list_id]  
  );  
  return result.rows[0];  
};  

const getMaterialListWithAvailables = async (project_id) => {
  const savedMaterials = await pool.query(
    `SELECT 
      ml.*,
      m.category,
      m.description,
      m.current_value,
      true as is_selected
    FROM material_lists ml
    JOIN materiales m ON ml.material_id = m.material_id
    WHERE ml.project_id = $1
    ORDER BY ml.list_id DESC`,
    [project_id]
  );

  const availableMaterials = await pool.query(
    `SELECT 
      m.*,
      false as is_selected
    FROM materiales m
    WHERE m.material_id NOT IN (
      SELECT material_id 
      FROM material_lists 
      WHERE project_id = $1
    )`,
    [project_id]
  );

  return [...savedMaterials.rows, ...availableMaterials.rows];
};
  
module.exports = {  
  addMaterialToList,  
  getMaterialListByProject,  
  getMaterialListByQuote,  
  updateMaterialQuantity,  
  removeMaterialFromList ,
  getMaterialListWithAvailables 
};  