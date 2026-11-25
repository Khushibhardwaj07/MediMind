// Loads the .env file and exports clean settings.
// If a required value is missing, we stop immediately with a clear message,
// instead of failing later with a confusing error.
require('dotenv').config();

const required = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_ACCESS_SECRET',
];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing environment variables in .env: ${missing.join(', ')}`);
  process.exit(1);
}

// A short secret is easy to guess, which would let attackers forge tokens.
if (process.env.JWT_ACCESS_SECRET.length < 32) {
  console.error('JWT_ACCESS_SECRET must be at least 32 characters long.');
  process.exit(1);
}

const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshDays: Number(process.env.REFRESH_TOKEN_DAYS) || 7,
  },
  // Higher = slower to crack, but also slower for us. 12 is a good balance.
  bcryptRounds: 12,
  // Websites allowed to call our API from a browser (comma-separated in .env).
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  rateLimit: {
    apiMax: Number(process.env.API_RATE_LIMIT_MAX) || 300,
    authMax: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  },
};

module.exports = config;