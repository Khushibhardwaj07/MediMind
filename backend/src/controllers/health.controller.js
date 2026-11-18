// A controller receives the request (req) and sends back a response (res).
const { query } = require('../config/db');

const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'medimind-backend',
    time: new Date().toISOString(),
  });
};

// Asks the database a trivial question to prove the connection works.
// We log the real error for ourselves but tell the client nothing sensitive.
const getDbHealth = async (req, res) => {
  try {
    await query('SELECT 1');
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (err) {
    console.error('Database health check failed:', err.message);
    res.status(503).json({ status: 'error', database: 'unreachable' });
  }
};

module.exports = { getHealth, getDbHealth };