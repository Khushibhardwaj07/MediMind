// Functions that talk to the "users" table. No business rules here, only SQL.
const { query } = require('../config/db');

// The shape we are allowed to send to the client. NEVER includes password_hash.
const toPublicUser = (row) => ({
  id: row.id,
  email: row.email,
  fullName: row.full_name,
  role: row.role,
  createdAt: row.created_at,
});

// The role is not a parameter on purpose: the database default is 'patient'.
const createUser = async ({ email, passwordHash, fullName }) => {
  const { rows } = await query(
    `INSERT INTO users (email, password_hash, full_name)
     VALUES ($1, $2, $3)
     RETURNING id, email, full_name, role, created_at`,
    [email, passwordHash, fullName]
  );
  return rows[0];
};

// Includes password_hash because login needs it to compare.
const findByEmail = async (email) => {
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
};

const findById = async (id) => {
  const { rows } = await query(
    'SELECT id, email, full_name, role, created_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

// For the admin page.
const listUsers = async (limit, offset) => {
  const { rows } = await query(
    `SELECT id, email, full_name, role, created_at
     FROM users
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows;
};

// Returns the updated user, or null if no user has that id.
const updateRole = async (id, role) => {
  const { rows } = await query(
    `UPDATE users SET role = $2 WHERE id = $1
     RETURNING id, email, full_name, role, created_at`,
    [id, role]
  );
  return rows[0] || null;
};

module.exports = { toPublicUser, createUser, findByEmail, findById, listUsers, updateRole };