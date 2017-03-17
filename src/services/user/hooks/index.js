const hooks = require('feathers-hooks');
const { iff, isNot } = require('feathers-hooks-common');
const { validate, auth } = require('../../../hooks');
const schema = require('../schema');

const isClient = () => hook => hook.data.tenantId === 'client';

const populateTenant = () => (hook) => {
  const { data, params } = hook;
  params.tenantId = data.tenantId;
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
