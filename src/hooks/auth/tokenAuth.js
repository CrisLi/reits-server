const { combine } = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;
const restrictToTenant = require('./restrict-to-tenant');
const populateTenant = require('./populate-tenant');
/*
@options
  - reits: wheather only reits tenant user can process the request.
*/
module.exports = options => (
  hook => (
    combine(
      auth.verifyToken(),
      auth.populateUser(),
      auth.restrictToAuthenticated(),
      restrictToTenant(options),
      populateTenant()
    ).call(this, hook)
  )
);
