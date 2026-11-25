const express = require('express');
const accessController = require('../controllers/access.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.get('/patients', authenticate, authorize('doctor'), accessController.listMyPatients);

module.exports = router;