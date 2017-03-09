const Joi = require('joi');

module.exports = {
  email: Joi.string().trim().min(3).max(30).required().email(),
  password: Joi.string().trim().max(30).required(),
  tenantId: Joi.required()
};
