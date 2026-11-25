const express = require('express');
const accessController = require('../controllers/access.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { grantSchema, doctorIdParamSchema } = require('../validators/access.validator');

const router = express.Router();

// Only patients manage who can see their data.
router.use(authenticate, authorize('patient'));

router.post('/', validate(grantSchema), accessController.grant);
router.get('/', accessController.listMyDoctors);
router.delete('/:doctorId', validate(doctorIdParamSchema, 'params'), accessController.revoke);

module.exports = router;