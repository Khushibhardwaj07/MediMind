const asyncHandler = require('../utils/asyncHandler');
const adminService = require('../services/admin.service');
const audit = require('../services/audit.service');

const listUsers = asyncHandler(async (req, res) => {
  const users = await adminService.listUsers(req.validated.query);
  res.status(200).json({ users });
});

const changeRole = asyncHandler(async (req, res) => {
  const user = await adminService.changeRole({
    actorId: req.user.id,
    targetId: req.params.id,
    role: req.body.role,
  });

  audit.record(req, `ROLE_CHANGED_TO_${req.body.role.toUpperCase()}`, {
    entity: 'user',
    entityId: user.id,
  });

  res.status(200).json({ user });
});

const listAuditLogs = asyncHandler(async (req, res) => {
  const logs = await adminService.listAuditLogs(req.validated.query);
  res.status(200).json({ logs });
});

module.exports = { listUsers, changeRole, listAuditLogs };