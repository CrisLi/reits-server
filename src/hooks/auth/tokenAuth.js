const { combine } = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;

module.exports = () => (
  (hook) => {
    combine(
      auth.verifyToken(),
      auth.populateUser(),
      auth.restrictToAuthenticated()
    ).call(this, hook);
  }
);
