const hooks = require('feathers-hooks');
const { iff, isNot } = require('feathers-hooks-common');
const { validate, auth } = require('../../../hooks');
const schema = require('../schema');

const isClient = () => hook => hook.data.tenantId === 'client';

const decorateForClient = () => (hook) => {
  const { data } = hook;
  if (data.tenantId === 'client') {
    data.roles = ['Client'];
  }
  return hook;
};

const normalizeData = () => (hook) => {
  const { data } = hook;
  if (!data.displayName) {
    data.displayName = data.username;
  }
  // The real login used username would be this.
  data.username = `${data.username}@${data.tenantId}`;
  return hook;
};

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
    decorateForClient(),
    iff(isNot(isClient()), auth.tokenAuth()),
    validate(schema),
    normalizeData(),
    auth.hashPassword()
  ],
  update: [
    decorateForClient(),
    auth.tokenAuth(),
    (hook) => {
      // only for pass schema validate, will not save into db.
      const { data } = hook;
      data.password = 'dummy';
    },
    validate(schema),
    hooks.remove('username', 'tenantId', 'password')
  ],
  patch: hooks.disable('external'),
  remove: hooks.disable('external')
};

exports.after = {
  all: [hooks.remove('password', '__v')]
};
