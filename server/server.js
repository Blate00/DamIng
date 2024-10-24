const express = require('express');
const cors = require('cors'); // Importa el paquete cors
const app = express();
const clientRoutes = require('./routes/clientRoutes');

app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Para poder recibir JSON en las solicitudes
app.use('/api', clientRoutes); // Asegúrate de que las rutas estén montadas correctamente

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});