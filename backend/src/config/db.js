// Creates ONE shared connection pool for the whole app.
// Other files import `query` from here instead of connecting themselves.
const { Pool } = require('pg');
const config = require('./env');

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  max: 10, // at most 10 connections open at once
});

// If an idle connection breaks, log it instead of crashing the whole app.
pool.on('error', (err) => {
  console.error('Unexpected database error:', err.message);
});

// Always pass user values in the `params` array ($1, $2...), never inside the text.
// This is what protects us from "SQL injection" attacks.
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };