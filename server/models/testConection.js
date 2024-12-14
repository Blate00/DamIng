const pool = require('./config');

const testConnection = async () => {
    try {
        const res = await pool.query('SELECT * FROM clients');
        console.log(res.rows); 
    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await pool.end(); 
    }
};

testConnection();