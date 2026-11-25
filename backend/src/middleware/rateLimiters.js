// Two limiters:
// 1) apiLimiter: a generous limit on everything, to stop floods of requests.
// 2) authLimiter: a strict limit on login/signup, to stop password guessing.
const rateLimit = require('express-rate-limit');
const config = require('../config/env');

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const apiLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: config.rateLimit.apiMax,
  standardHeaders: 'draft-7', // adds RateLimit headers so clients can see their limit
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: config.rateLimit.authMax,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  // Successful requests (status below 400) are not counted, so real users who
  // type the right password are never punished. Only failures add up.
  skipSuccessfulRequests: true,
  message: { error: 'Too many failed attempts, please try again in 15 minutes' },
});

module.exports = { apiLimiter, authLimiter };