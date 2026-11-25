// Returns a middleware that checks part of the request against a Zod schema.
// source is 'body' (default), 'params' (the :id in a URL) or 'query' (?limit=5).
// For the body we replace req.body with the CLEANED data (trimmed, lowercased,
// unknown fields removed). For params and query we put the cleaned data in
// req.validated, because Express does not let us overwrite those.
const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (source === 'body') {
    req.body = result.data;
  } else {
    req.validated = req.validated || {};
    req.validated[source] = result.data;
  }

  return next();
};

module.exports = validate;