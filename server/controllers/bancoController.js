   // server/controllers/bancoController.js
   const bancoModel = require('../models/db/bancoModel');

   const fetchBancos = async (req, res) => {
     try {
       const bancos = await bancoModel.getBancos();
       res.json(bancos);
     } catch (error) {
       console.error('Error fetching bancos:', error.message);
       res.status(500).json({ error: error.message });
     }
   };

   module.exports = {
     fetchBancos,
   };