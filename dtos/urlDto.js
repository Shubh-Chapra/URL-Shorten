const Joi = require("joi");

exports.CreateUrlDto = Joi.object({
  original_url: Joi.string().uri().required(),
  short_code: Joi.string().alphanum().min(3).max(10).optional(),
  userCode: Joi.string().optional(),
  expires_at: Joi.date().greater("now").optional()
});

exports.UpdateUrlDto = Joi.object({
  original_url: Joi.string().uri().optional(),
  short_code: Joi.string().alphanum().min(3).max(10).optional(),
  updateFlag: Joi.boolean().optional(),
  userCode: Joi.string().optional(),
  expires_at: Joi.date().greater("now").optional()
});
