   const pool = require('../config');

   const getBancos = async () => {
     const { rows } = await pool.query('SELECT * FROM banco');
     return rows;
   };

   module.exports = {
     getBancos,
   };