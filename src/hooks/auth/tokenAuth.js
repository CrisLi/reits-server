const { combine } = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;
const restrictToTenant = require('./restrict-to-tenant');

module.exports = () => (
  hook => (
    combine(
      auth.verifyToken(),
      auth.populateUser(),
      auth.restrictToAuthenticated(),
      restrictToTenant()
    ).call(this, hook)
  )
);
