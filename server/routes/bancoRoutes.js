   // server/routes/bancoRoutes.js
   const express = require('express');
   const bancoController = require('../controllers/bancoController');

   const router = express.Router();

   router.get('/banco', bancoController.fetchBancos);

   module.exports = router;