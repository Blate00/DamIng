const listaMaterialesModel = require('../models/db/listaMaterialesModel');
const pool = require('../models/config');  
// Agregar material a la lista  
// En listaMaterialesController.js  
const addMaterialsToList = async (req, res) => {  
  const { project_id, quote_number, materials } = req.body;  
  const client = await pool.connect();  
  
  try {  
    await client.query('BEGIN');  
  
    // Eliminar materiales existentes  
    await client.query(  
      'DELETE FROM material_lists WHERE project_id = \$1',  
      [project_id]  
    );  
  
    // Insertar nuevos materiales  
    const insertPromises = materials.map(material =>  
      client.query(  
        `INSERT INTO material_lists   
        (project_id, quote_number, material_id, quantity, unit_value)   
        VALUES (\$1, \$2, \$3, \$4, \$5)   
        RETURNING *`,  
        [  
          project_id,  
          quote_number,  
          material.material_id,  
          material.quantity,  
          material.unit_value  
        ]  
      )  
    );  
  
    const results = await Promise.all(insertPromises);  
    await client.query('COMMIT');  
  
    res.status(201).json({  
      message: 'Materiales guardados exitosamente',  
      materials: results.map(r => r.rows[0])  
    });  
  } catch (error) {  
    await client.query('ROLLBACK');  
    console.error('Error saving materials:', error);  
    res.status(500).json({  
      error: 'Error al guardar los materiales',  
      details: error.message  
    });  
  } finally {  
    client.release();  
  }  
};  
// Obtener lista de materiales por proyecto  
const getMaterialListByProject = async (req, res) => {
  try {
    const { project_id } = req.params;
    const materialList = await listaMaterialesModel.getMaterialListByProject(project_id);
    res.json(materialList);
  } catch (error) {
    console.error('Error fetching material list:', error);
    res.status(500).json({ error: 'Error al obtener lista de materiales', details: error.message });
  }
};

// Obtener lista de materiales por cotización  
const getMaterialListByQuote = async (req, res) => {
  try {
    const { quote_number } = req.params;
    const materialList = await listaMaterialesModel.getMaterialListByQuote(quote_number);
    res.json(materialList);
  } catch (error) {
    console.error('Error fetching material list:', error);
    res.status(500).json({ error: 'Error al obtener lista de materiales', details: error.message });
  }
};

// Actualizar cantidad de material  
const updateMaterialQuantity = async (req, res) => {
  try {
    const { list_id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({ error: 'La cantidad debe ser un número positivo' });
    }

    const updatedItem = await listaMaterialesModel.updateMaterialQuantity(list_id, quantity);

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating material quantity:', error);
    res.status(500).json({ error: 'Error al actualizar cantidad', details: error.message });
  }
};

// Eliminar material de la lista  
const removeMaterialFromList = async (req, res) => {
  try {
    const { list_id } = req.params;
    const deletedItem = await listaMaterialesModel.removeMaterialFromList(list_id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    res.json({ message: 'Material eliminado de la lista exitosamente', item: deletedItem });
  } catch (error) {
    console.error('Error removing material from list:', error);
    res.status(500).json({ error: 'Error al eliminar material de la lista', details: error.message });
  }
};
const getMaterialListWithAvailables = async (req, res) => {
  try {
    const { project_id } = req.params;
    const materialList = await listaMaterialesModel.getMaterialListWithAvailables(project_id);
    res.json(materialList);
  } catch (error) {
    console.error('Error fetching material list:', error);
    res.status(500).json({ error: 'Error al obtener lista de materiales', details: error.message });
  }
};
module.exports = {
  addMaterialsToList,
  getMaterialListByProject,
  getMaterialListByQuote,
  updateMaterialQuantity,
  removeMaterialFromList,
  getMaterialListWithAvailables
};  