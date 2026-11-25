const { z } = require('zod');

const grantSchema = z.object({
  doctorEmail: z.string().trim().toLowerCase().email().max(254),
});

const doctorIdParamSchema = z.object({
  doctorId: z.string().uuid('Invalid doctor id'),
});

module.exports = { grantSchema, doctorIdParamSchema };