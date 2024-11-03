   const express = require('express');
   const tipoCuentaController = require('../controllers/tipoCuentaController');

   const router = express.Router();

   router.get('/tipocuenta', tipoCuentaController.fetchTiposCuenta);

   module.exports = router;