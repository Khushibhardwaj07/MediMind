// Loads the .env file into process.env, then exports clean settings.
// We do this in ONE place so the rest of the app never reads process.env directly.
require('dotenv').config();

const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = config;