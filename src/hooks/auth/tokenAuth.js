const auth = require('feathers-authentication').hooks;

module.exports = () => (
  [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ]
);
