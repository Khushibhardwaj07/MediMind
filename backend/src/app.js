// Builds the Express app. We keep this separate from server.js
// so that tests (Phase 14) can use the app without starting a real server.
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(helmet());                          // safety headers
app.use(cors());                            // open for now; we lock it down in Phase 4
app.use(express.json({ limit: '100kb' }));  // read JSON bodies, reject huge ones

app.use('/api', routes);                    // every route starts with /api

// If no route matched, send a clean 404 (never leak internal details).
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Last-resort error handler. The 4 parameters (err, req, res, next)
// are how Express knows this is an error handler.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Errors we threw on purpose (AppError) have messages that are safe to show.
  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // The client sent broken JSON.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  // Anything else is a bug: log the details for us, hide them from the client.
  console.error(err);
  return res.status(500).json({ error: 'Something went wrong' });
});

module.exports = app;