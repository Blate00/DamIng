   const express = require('express');
   const cors = require('cors');
   const app = express();

   // Importa las rutas
   const clientRoutes = require('./routes/clientRoutes');
   const empleadoRoutes = require('./routes/empleadoRoutes');
   const bancoRoutes = require('./routes/bancoRoutes'); // Nueva ruta
   const tipoCuentaRoutes = require('./routes/tipoCuentaRoutes'); // Nueva ruta
   const projectRoutes = require('./routes/projectRoutes')

   app.use(cors());
   app.use(express.json());

   // Monta las rutas
   app.use('/api', clientRoutes);
   app.use('/api', empleadoRoutes);
   app.use('/api', bancoRoutes); // Nueva ruta
   app.use('/api', tipoCuentaRoutes); // Nueva ruta
   app.use('/api', projectRoutes);

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
   });