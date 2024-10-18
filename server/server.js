// server/server.js
const express = require('express');
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes');

const app = express();
const port = 5432;

// Configurar CORS
app.use(cors());

// Usar las rutas
app.use('/api', dataRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});