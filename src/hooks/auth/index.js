const auth = require('feathers-authentication').hooks;
const tokenAuth = require('./tokenAuth');
const restrictToTenant = require('./restrictToTenant');

module.exports = Object.assign({}, auth, {
  tokenAuth,
  restrictToTenant
});
