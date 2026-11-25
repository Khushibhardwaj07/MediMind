// The one function the whole app uses to write an audit log.
// Usage: audit.record(req, 'LOGIN', { userId, entity: 'user', entityId })
// If userId is not given, we use the logged-in user (req.user).
const auditLogModel = require('../models/auditLog.model');

const record = (req, action, { userId, entity, entityId } = {}) => {
  // We do NOT wait (no await) and we swallow errors: a failed log
  // must never break the request the user is waiting for.
  auditLogModel
    .create({
      userId: userId || (req.user && req.user.id) || null,
      action,
      entity: entity || null,
      entityId: entityId ? String(entityId) : null,
      ip: req.ip || null,
    })
    .catch((err) => console.error('Audit log failed:', err.message));
};

module.exports = { record };