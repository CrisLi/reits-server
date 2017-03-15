const auth = require('feathers-authentication').hooks;
const tokenAuth = require('./tokenAuth');
const restrictToTenant = require('./restrict-to-tenant');

module.exports = Object.assign({}, auth, {
  tokenAuth,
  restrictToTenant
});
