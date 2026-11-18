const express = require('express');
const { getHealth, getDbHealth } = require('../controllers/health.controller');

const router = express.Router();

router.get('/', getHealth);
router.get('/db', getDbHealth);

module.exports = router;