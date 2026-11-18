// One command that: (1) creates the database if missing,
// (2) builds the tables, (3) inserts the seed data.
// Safe to run many times.
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const config = require('../src/config/env');

const { host, port, user, password, name } = config.db;

async function ensureDatabaseExists() {
  // We put the name straight into SQL below (CREATE DATABASE can't use $1),
  // so we only allow safe characters.
  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    throw new Error('DB_NAME may only contain letters, numbers and underscores.');
  }

  // Connect to the built-in "postgres" database first, because
  // our own database may not exist yet.
  const admin = new Client({ host, port, user, password, database: 'postgres' });
  await admin.connect();
  try {
    const found = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [name]);
    if (found.rowCount === 0) {
      await admin.query(`CREATE DATABASE ${name}`);
      console.log(`Created database "${name}"`);
    } else {
      console.log(`Database "${name}" already exists`);
    }
  } finally {
    await admin.end();
  }
}

async function runSqlFile(client, filename) {
  const sql = fs.readFileSync(path.join(__dirname, filename), 'utf8');
  await client.query(sql);
  console.log(`Applied ${filename}`);
}

async function main() {
  await ensureDatabaseExists();

  const client = new Client({ host, port, user, password, database: name });
  await client.connect();
  try {
    await runSqlFile(client, 'schema.sql');
    await runSqlFile(client, 'seed.sql');
  } finally {
    await client.end();
  }
  console.log('Database setup complete.');
}

main().catch((err) => {
  console.error('Database setup failed:', err.message);
  process.exit(1);
});