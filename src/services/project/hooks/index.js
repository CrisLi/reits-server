const hooks = require('feathers-hooks');
const { validate, auth } = require('../../../hooks');
const schema = require('../schema');

exports.before = {
  all: [
    hooks.remove('_id', 'updatedAt', 'createdAt', '__v')
  ],
  find: [
    auth.tokenAuth()
  ],
  get: [
    auth.tokenAuth()
  ],
  create: [
    auth.tokenAuth(),
    validate(schema)
  ],
  update: [
    auth.tokenAuth(),
    validate(schema),
    hooks.remove('name', 'status')
  ],
  patch: hooks.disable('external'),
  remove: hooks.disable('external')
};

exports.after = {
  all: [hooks.remove('__v')]
};
