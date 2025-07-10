const Joi = require('joi');

const UserRegisterDto = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const UserLoginDto = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = {
  UserRegisterDto,
  UserLoginDto
};
