const tenants = require('./tenants');
const users = require('./users');

module.exports = app => (Promise.all([tenants(app), users(app)]));
