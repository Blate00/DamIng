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
const archivesRoutes = require('./routes/archivesRoutes');
const presupuestoRoutes = require('./routes/presupuestoRoutes');
const rendicionRoutes = require('./routes/rendicionRoutes');
const asignacionRoutes = require('./routes/asignacionRoutes');
const manoObraRoutes = require('./routes/mObraRoutes');
const flujoRoutes = require('./routes/flujoRoutes');
const materialRoutes = require('./routes/materialRoutes'); // Nueva importación

app.use(cors());
app.use(express.json());

// Monta las rutas
app.use('/api', clientRoutes);
app.use('/api', empleadoRoutes);
app.use('/api', bancoRoutes);
app.use('/api', tipoCuentaRoutes);
app.use('/api', projectRoutes);
app.use('/api', taskRoutes);
app.use('/api', archivesRoutes); 
app.use('/api', presupuestoRoutes);
app.use('/api', rendicionRoutes);
app.use('/api', asignacionRoutes);
app.use('/api', manoObraRoutes);
app.use('/api/flujo', flujoRoutes);
app.use('/api', materialRoutes); // Nueva ruta montada

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});