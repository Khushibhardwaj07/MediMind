// Returns a middleware that checks req.body against a Zod schema.
// On success, req.body is replaced with the CLEANED data
// (trimmed, lowercased, and with unknown fields removed).
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  return next();
};

module.exports = validate;