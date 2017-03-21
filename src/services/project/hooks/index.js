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
