   const express = require('express');
   const router = express.Router();
   const pool = require('../models/config');

   // Obtener clientes
   router.get('/clients', async (req, res) => {
     try {
       const result = await pool.query('SELECT * FROM clients');
       res.json(result.rows);
     } catch (error) {
       console.error('Error fetching clients:', error);
       res.status(500).json({ error: 'Error fetching clients' });
     }
   });

   // Agregar cliente
   router.post('/clients', async (req, res) => {
     const { name, email, phone_number } = req.body;
     try {
       const result = await pool.query(
         'INSERT INTO clients (name, email, phone_number) VALUES (\$1, \$2, \$3) RETURNING *',
         [name, email, phone_number]
       );
       res.json(result.rows[0]);
     } catch (error) {
       console.error('Error adding client:', error);
       res.status(500).json({ error: 'Error adding client' });
     }
   });

   module.exports = router;