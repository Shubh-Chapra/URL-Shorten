const Joi = require("joi");

// ✅ App registration DTO
const RegisterAppDto = Joi.object({
  name: Joi.string().min(2).required().messages({
    'string.empty': 'App name is required',
    'any.required': 'App name is required'
  }),
  base_url: Joi.string().uri().required().messages({
    'string.uri': 'Base URL must be a valid URI',
    'any.required': 'Base URL is required'
  })
});

module.exports = {
  RegisterAppDto
};
