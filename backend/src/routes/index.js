// Collects all routes in one place. Later phases add more lines here.
const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const accessRoutes = require('./access.routes');
const doctorRoutes = require('./doctor.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/access', accessRoutes);
router.use('/doctor', doctorRoutes);

module.exports = router;