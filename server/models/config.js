const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // tu usuario de PostgreSQL
  host: 'localhost',
  database: 'daming',
  password: '3214',
  port: 5432, // puerto por defecto de PostgreSQL
});

module.exports = pool;


