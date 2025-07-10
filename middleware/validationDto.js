module.exports = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail) => ({
          path: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    req[source] = value; // use parsed + validated data
    next();
  };
};
