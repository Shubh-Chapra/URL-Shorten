const Joi = require("joi");

exports.CreateUrlDto = Joi.object({
  short_code: Joi.string().alphanum().min(3).max(10).optional(),
  user_code: Joi.string().optional(),
  entity_type: Joi.string().required(), // e.g. "artist", "playlist"
  entity_id: Joi.string().required(),   // e.g. "abc123"
  redirect_path: Joi.string().optional(), // If provided, overrides dynamic path
  extra_params: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
  expiration_date: Joi.date().greater("now").optional()
});

exports.UpdateUrlDto = Joi.object({
  short_code: Joi.string().alphanum().min(3).max(10).optional(),
  user_code: Joi.string().optional(),
  entity_type: Joi.string().optional(),
  entity_id: Joi.string().optional(),
  redirect_path: Joi.string().optional(),
  extra_params: Joi.object().pattern(Joi.string(), Joi.any()).optional(),
  update_flag: Joi.boolean().optional(),
  expiration_date: Joi.date().greater("now").optional()
});

