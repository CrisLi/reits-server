const validateSchema = require('feathers-hooks-validate-joi');

const defaultOptions = {
  abortEarly: false,
  convert: true,
  allowUnknown: true,
  stripUnknown: false
};

module.exports = (schema, options = {}) => (
  validateSchema.form(schema, Object.assign(defaultOptions, options))
);
