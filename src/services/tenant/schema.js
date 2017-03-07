const Joi = require('joi');

module.exports = {
  name: Joi.string().trim().min(3).max(30).required(),
  description: Joi.string().trim().max(300)
};
