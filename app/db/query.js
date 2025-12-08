const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.RDS_HOSTNAME || 'localhost',
  port: process.env.RDS_PORT || 5432,
  database: process.env.RDS_DB_NAME || 'NeighborAid',
  user: process.env.RDS_USERNAME || 'postgres',
  password: process.env.RDS_PASSWORD || 'postgres',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
