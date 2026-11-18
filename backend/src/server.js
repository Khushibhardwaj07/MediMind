// Starts the server, but only AFTER confirming the database is reachable.
const app = require('./app');
const config = require('./config/env');
const { pool } = require('./config/db');

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('Database connected');
  } catch (err) {
    console.error('Could not connect to the database:', err.message);
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`MediMind backend running on http://localhost:${config.port}`);
  });
}

start();