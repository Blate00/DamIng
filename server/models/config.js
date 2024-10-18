const { Pool } = require('pg');

export const dbConfig = {
    user: 'root',
    host: 'localhost',
    database: 'daming',
    password: '',
    port: 5432,
};

export async function createConnection() {
    const pool = new Pool(dbConfig);
    try {
        const client = await pool.connect();
        console.log('Connected to the database');
        return client;
    } catch (error) {
        console.error('Error connecting to the database: ', error);
    }
}