const hooks = require('feathers-hooks');
const { auth } = require('../../../hooks');

exports.before = {
  all: [
    hooks.remove('_id', 'updatedAt', 'createdAt', '__v')
  ],
  find: [
    auth.tokenAuth()
  ],
  get: hooks.disable('external'),
  create: hooks.disable('external'),
  update: hooks.disable('external'),
  patch: hooks.disable('external'),
  remove: hooks.disable('external')
};

exports.after = {
  all: [hooks.remove('__v', 'updatedAt', '_id')]
};
