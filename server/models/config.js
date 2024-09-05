import mysql from 'mysql2/promise';

export const dbConfig  = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'ferremas'
}

export async function createConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error('Error connecting to the database: ', error);
    }
} 