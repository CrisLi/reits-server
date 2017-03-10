const hooks = require('feathers-hooks');
const { iff, isNot } = require('feathers-hooks-common');
const { validate, checkTenant, auth } = require('../../../hooks');
const schema = require('../schema');

const isClient = () => hook => hook.data.tenantId === 'client';

exports.before = {
  all: [
    hooks.remove('_id', 'updatedAt', 'createdAt', '__v')
  ],
  find: [
    auth.tokenAuth(),
    auth.restrictToTenant()
  ],
  get: [
    auth.tokenAuth(),
    auth.restrictToOwner({ ownerField: '_id' })
  ],
  create: [
    validate(schema),
    iff(isNot(isClient()), auth.tokenAuth()),
    checkTenant(hook => hook.data.tenantId),
    auth.restrictToTenant(),
    auth.hashPassword()
  ],
  update: [
    auth.tokenAuth(),
    auth.restrictToOwner({ ownerField: '_id' })
  ],
  patch: [
    auth.tokenAuth(),
    auth.restrictToOwner({ ownerField: '_id' })
  ],
  remove: [
    auth.tokenAuth(),
    auth.restrictToOwner({ ownerField: '_id' })
  ]
};

exports.after = {
  all: [hooks.remove('password', '__v')]
};
