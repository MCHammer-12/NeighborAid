const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'NeighborAid',
  user: 'postgres',
  password: 'your_password'
});

module.exports = pool;