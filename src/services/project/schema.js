const Joi = require('joi');

module.exports = {
  name: Joi.string().trim().min(3).max(30).required(),
  type: Joi.string().trim().valid('Public', 'Private').required(),
  status: Joi.string().trim().valid('New', 'In Progress', 'Done').required(),
  address: Joi.required()
};
