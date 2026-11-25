const AppError = require('../utils/appError');
const userModel = require('../models/user.model');
const refreshTokenModel = require('../models/refreshToken.model');
const auditLogModel = require('../models/auditLog.model');

const listUsers = async ({ limit, offset }) => {
  const rows = await userModel.listUsers(limit, offset);
  return rows.map(userModel.toPublicUser);
};

const changeRole = async ({ actorId, targetId, role }) => {
  // Stops an admin from accidentally removing the last admin (themselves).
  if (actorId === targetId) {
    throw new AppError(400, 'You cannot change your own role');
  }

  const updated = await userModel.updateRole(targetId, role);
  if (!updated) {
    throw new AppError(404, 'User not found');
  }

  // Cancel their sessions so the new role is picked up when they log in again.
  await refreshTokenModel.revokeAllForUser(targetId);

  return userModel.toPublicUser(updated);
};

const listAuditLogs = ({ limit, offset }) => auditLogModel.list(limit, offset);

module.exports = { listUsers, changeRole, listAuditLogs };