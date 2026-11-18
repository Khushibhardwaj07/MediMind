// Starts the server. This is the file we actually run.
const app = require('./app');
const config = require('./config/env');

app.listen(config.port, () => {
  console.log(`MediMind backend running on http://localhost:${config.port}`);
});