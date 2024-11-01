   // server/models/db/tipoCuentaModel.js
   const pool = require('../config');

   const getTiposCuenta = async () => {
     const { rows } = await pool.query('SELECT * FROM tipocuenta');
     return rows;
   };

   module.exports = {
     getTiposCuenta,
   };