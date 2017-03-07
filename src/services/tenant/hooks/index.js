const hooks = require('feathers-hooks');
const slug = require('slug');
const { iff, isProvider } = require('feathers-hooks-common');
const validate = require('../../../hooks/validate');
const schema = require('../schema');

const setValue = (key, cb) => (
  (hook) => {
    const { data } = hook;
    data[key] = cb(data);
  }
);

exports.before = {
  create: [
    hooks.remove('type'),
    validate(schema),
    setValue('slug', data => slug(data.name, { lower: true })),
    iff(isProvider('external'), setValue('type', () => 'Provider'))
  ],
  update: [
    hooks.remove('type')
  ],
  patch: [
    hooks.remove('type')
  ]
};
