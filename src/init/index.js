const tenants = require('./tenants');
const users = require('./users');

module.exports = app => (tenants(app).then(() => users(app)));
