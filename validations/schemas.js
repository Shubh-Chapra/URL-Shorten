const Joi = require('joi');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

// URL validation schemas
const urlSchemas = {
  createShortUrl: Joi.object({
    originalUrl: Joi.string().uri().required(),
    customAlias: Joi.string().alphanum().min(3).max(20).optional(),
    expiresAt: Joi.date().greater('now').optional()
  }),

  updateUrl: Joi.object({
    originalUrl: Joi.string().uri().optional(),
    isActive: Joi.boolean().optional()
  })
};

module.exports = {
  userSchemas,
  urlSchemas
};
