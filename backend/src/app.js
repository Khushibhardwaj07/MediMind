// Builds the Express app. We keep this separate from server.js
// so that tests (Phase 14) can use the app without starting a real server.
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(helmet());          // safety headers
app.use(cors());            // open for now; we lock it down in Phase 4
app.use(express.json());    // lets us read JSON sent by the client

app.use('/api', routes);    // every route starts with /api

// If no route matched, send a clean 404 (never leak internal details).
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Last-resort error handler: log the details for us, send a safe message to the client.
// The 4 parameters (err, req, res, next) are how Express knows this is an error handler.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

module.exports = app;