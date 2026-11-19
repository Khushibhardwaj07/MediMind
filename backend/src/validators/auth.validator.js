const { z } = require('zod');

// Passwords: bcrypt only reads the first 72 bytes, so we cap at 72.
const passwordRule = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Emails are trimmed and lowercased so "A@x.com" and "a@x.com" are the same account.
const emailRule = z.string().trim().toLowerCase().email().max(254);

const signupSchema = z.object({
  email: emailRule,
  password: passwordRule,
  fullName: z.string().trim().min(2).max(100),
});

// For login we don't re-check password strength, only that something was sent.
const loginSchema = z.object({
  email: emailRule,
  password: z.string().min(1).max(72),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1).max(512),
});

module.exports = { signupSchema, loginSchema, refreshSchema };