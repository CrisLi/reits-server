const hooks = require('feathers-hooks');
const { validate, auth } = require('../../../hooks');
const schema = require('../schema');

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
    auth.restrictToTenant()
  ],
  create: [
    auth.tokenAuth(),
    auth.restrictToTenant(),
    validate(schema),
    (hook) => {
      const { data, params } = hook;
      data['tenantId'] = params.tenantId;
      return hook;
    }
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
