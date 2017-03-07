const hooks = require('feathers-hooks');
const slug = require('slug');
const { iff, isProvider } = require('feathers-hooks-common');

const setValue = (key, cb) => (
  (hook) => {
    const { data } = hook;
    data[key] = cb(data);
  }
);

exports.before = {
  create: [
    hooks.remove('type'),
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
