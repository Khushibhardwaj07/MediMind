// A route connects a URL + method (GET, POST...) to a controller function.
const express = require('express');
const { getHealth } = require('../controllers/health.controller');

const router = express.Router();

router.get('/', getHealth);

module.exports = router;