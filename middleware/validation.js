const { userSchemas, urlSchemas } = require('../validations/schemas');

// Generic validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    req.body = value; // Use validated data
    next();
  };
};

// Specific validation middlewares
const validateUserRegistration = validateRequest(userSchemas.register);
const validateUserLogin = validateRequest(userSchemas.login);
const validateUrlCreation = validateRequest(urlSchemas.createShortUrl);
const validateUrlUpdate = validateRequest(urlSchemas.updateUrl);

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUrlCreation,
  validateUrlUpdate
};
