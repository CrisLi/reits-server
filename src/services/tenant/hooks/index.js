const hooks = require('feathers-hooks');
const slug = require('slug');
const { iff, isProvider } = require('feathers-hooks-common');
const { validate } = require('../../../hooks');
const schema = require('../schema');

const setValue = (key, cb) => (
  (hook) => {
    const { data } = hook;
    data[key] = cb(data);
  }
);

const externalRequest = () => (
  iff(isProvider('external'), (hook) => {
    const { params: { query } } = hook;
    query['type'] = 'Provider';
  })
);

exports.before = {
  all: [
    hooks.remove('_id', 'updatedAt', 'createdAt', '__v')
  ],
  find: [
    externalRequest()
  ],
  create: [
    hooks.remove('type'),
    validate(schema),
    setValue('slug', data => slug(data.name, { lower: true })),
    iff(isProvider('external'), setValue('type', () => 'Provider'))
  ],
  update: [
    (hook) => {
      console.log(hook.id);
    },
    hooks.remove('name', 'type', 'slug'),
    externalRequest()
  ],
  patch: [
    hooks.remove('name', 'type', 'slug'),
    externalRequest()
  ],
  remove: hooks.disable('external')
};

exports.after = {
  all: [
    hooks.remove('type', '__v')
  ]
};
