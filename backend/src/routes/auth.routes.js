const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const { authLimiter } = require('../middleware/rateLimiters');
const { signupSchema, loginSchema, refreshSchema } = require('../validators/auth.validator');

const router = express.Router();

// Each route reads left to right: limit, then validate, then run the controller.
router.post('/signup', authLimiter, validate(signupSchema), authController.signup);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.post('/logout', validate(refreshSchema), authController.logout);

// authenticate runs first, so only logged-in users reach the controller.
router.get('/me', authenticate, authController.me);

module.exports = router;