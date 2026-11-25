const { z } = require('zod');

// A user id in the URL must look like a real UUID.
const idParamSchema = z.object({
  id: z.string().uuid('Invalid user id'),
});

const roleSchema = z.object({
  role: z.enum(['patient', 'doctor', 'admin']),
});

// Query strings arrive as text, so z.coerce turns "50" into the number 50.
const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

module.exports = { idParamSchema, roleSchema, listQuerySchema };