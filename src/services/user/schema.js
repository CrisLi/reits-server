const Joi = require('joi');

module.exports = {
  username: Joi.string().trim().min(3).max(20).required(),
  password: Joi.string().trim().max(20).required(),
  tenantId: Joi.string().trim().max(20).required(),
  email: Joi.string().trim().min(3).max(20).email(),
  roles: Joi.array().items(Joi.string().valid('Admin', 'PM', 'FA', 'Finance', 'Client')).required(),
  displayName: Joi.string().trim().max(20)
};
