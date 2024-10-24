const pool = require('./config');

const testConnection = async () => {
    try {
        const res = await pool.query('SELECT * FROM clients');
        console.log(res.rows); // Deberías ver los datos de la tabla clients
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await pool.end(); // Cierra la conexión
    }
};

testConnection();