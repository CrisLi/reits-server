const hooks = require('feathers-hooks');
const { iff, isNot } = require('feathers-hooks-common');
const { validate, auth } = require('../../../hooks');
const schema = require('../schema');

const isClient = () => hook => hook.data.tenantId === 'client';

const populateTenant = () => (hook) => {
  const { data, params } = hook;
  if (!data.tenantId) {
    data.tenantId = 'client';
    data.roles = ['Client'];
  }
  params.tenantId = data.tenantId;
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
    populateTenant(),
    iff(isNot(isClient()), auth.tokenAuth()),
    validate(schema),
    normalizeData(),
    auth.hashPassword()
  ],
  update: [
    auth.tokenAuth(),
    validate(schema)
  ],
  patch: hooks.disable('external'),
  remove: hooks.disable('external')
};

exports.after = {
  all: [hooks.remove('password', '__v')]
};
