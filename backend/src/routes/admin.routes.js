const express = require('express');
const adminController = require('../controllers/admin.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const {
  idParamSchema,
  roleSchema,
  listQuerySchema,
} = require('../validators/admin.validator');

const router = express.Router();

// Everything in this file needs: a valid login AND the admin role.
router.use(authenticate, authorize('admin'));

router.get('/users', validate(listQuerySchema, 'query'), adminController.listUsers);

router.patch(
  '/users/:id/role',
  validate(idParamSchema, 'params'),
  validate(roleSchema),
  adminController.changeRole
);

router.get('/audit-logs', validate(listQuerySchema, 'query'), adminController.listAuditLogs);

module.exports = router;