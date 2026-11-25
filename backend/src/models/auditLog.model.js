// SQL for the "audit_logs" table.
const { query } = require('../config/db');

const create = async ({ userId, action, entity, entityId, ip }) => {
  await query(
    `INSERT INTO audit_logs (user_id, action, entity, entity_id, ip_address)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, action, entity, entityId, ip]
  );
};

// Newest first. LEFT JOIN keeps rows even when the user was later deleted.
const list = async (limit, offset) => {
  const { rows } = await query(
    `SELECT a.id, a.user_id, u.email AS user_email, a.action, a.entity,
            a.entity_id, a.ip_address, a.created_at
     FROM audit_logs a
     LEFT JOIN users u ON u.id = a.user_id
     ORDER BY a.id DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    userEmail: row.user_email,
    action: row.action,
    entity: row.entity,
    entityId: row.entity_id,
    ipAddress: row.ip_address,
    createdAt: row.created_at,
  }));
};

module.exports = { create, list };