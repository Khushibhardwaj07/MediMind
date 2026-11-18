// Collects all routes in one place. Later phases add more lines here.
const express = require('express');
const healthRoutes = require('./health.routes');

const router = express.Router();

router.use('/health', healthRoutes);

module.exports = router;