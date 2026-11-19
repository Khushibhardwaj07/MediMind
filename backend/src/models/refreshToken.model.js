// Functions for the "refresh_tokens" table. We only ever handle HASHES here.
const { query } = require('../config/db');

const create = async ({ userId, tokenHash, expiresAt }) => {
  await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );
};

const findByHash = async (tokenHash) => {
  const { rows } = await query('SELECT * FROM refresh_tokens WHERE token_hash = $1', [tokenHash]);
  return rows[0] || null;
};

// Marks a token as used, but ONLY if it wasn't already.
// Returns true if WE were the one who revoked it. If two requests use the same
// token at the same instant, only one of them wins.
const revokeIfActive = async (id) => {
  const result = await query(
    'UPDATE refresh_tokens SET revoked = true WHERE id = $1 AND revoked = false',
    [id]
  );
  return result.rowCount === 1;
};

const revokeByHash = async (tokenHash) => {
  await query('UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1', [tokenHash]);
};

const revokeAllForUser = async (userId) => {
  await query('UPDATE refresh_tokens SET revoked = true WHERE user_id = $1', [userId]);
};

module.exports = { create, findByHash, revokeIfActive, revokeByHash, revokeAllForUser };