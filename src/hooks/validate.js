const validateSchema = require('feathers-hooks-validate-joi');

const defaultOptions = {
  abortEarly: false,
  convert: true,
  allowUnknown: false,
  stripUnknown: true
};

module.exports = (schema, options = {}) => (
  validateSchema.form(schema, Object.assign(defaultOptions, options))
);
