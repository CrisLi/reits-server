const hooks = require('feathers-hooks');
const { iff, isProvider } = require('feathers-hooks-common');
const slug = require('slug');
const { validate, auth } = require('../../../hooks');
const afterCreate = require('./after-create');
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
    auth.tokenAuth(),
    auth.restrictToTenant({ reits: true }),
    externalRequest()
  ],
  get: [
    auth.tokenAuth(),
    auth.restrictToTenant(),
    externalRequest()
  ],
  create: [
    auth.tokenAuth(),
    auth.restrictToTenant({ reits: true }),
    validate(schema),
    setValue('_id', data => slug(data.name, { lower: true })),
    iff(isProvider('external'), setValue('type', () => 'Provider'))
  ],
  update: [
    auth.tokenAuth(),
    auth.restrictToTenant({ reits: true }),
    validate(schema),
    hooks.remove('_id', 'name', 'type')
  ],
  patch: hooks.disable('external'),
  remove: hooks.disable('external')
};

exports.after = {
  all: [
    hooks.remove('type', '__v')
  ],
  create: [
    afterCreate()
  ]
};
