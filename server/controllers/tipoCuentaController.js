   // server/controllers/tipoCuentaController.js
   const tipoCuentaModel = require('../models/db/tipoCuentaModel');

   const fetchTiposCuenta = async (req, res) => {
     try {
       const tiposCuenta = await tipoCuentaModel.getTiposCuenta();
       res.json(tiposCuenta);
     } catch (error) {
       console.error('Error fetching tipos de cuenta:', error.message);
       res.status(500).json({ error: error.message });
     }
   };

   module.exports = {
     fetchTiposCuenta,
   };