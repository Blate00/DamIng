// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Importa las rutas
const taskRoutes = require('./routes/taskRoutes');
const clientRoutes = require('./routes/clientRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const bancoRoutes = require('./routes/bancoRoutes');
const tipoCuentaRoutes = require('./routes/tipoCuentaRoutes');
const projectRoutes = require('./routes/projectRoutes');
const archivesRoutes = require('./routes/archivesRoutes'); // Add this line

app.use(cors());
app.use(express.json());

// Monta las rutas
app.use('/api', clientRoutes);
app.use('/api', empleadoRoutes);
app.use('/api', bancoRoutes);
app.use('/api', tipoCuentaRoutes);
app.use('/api', projectRoutes);
app.use('/api', taskRoutes);
app.use('/api', archivesRoutes); // Add this line

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});