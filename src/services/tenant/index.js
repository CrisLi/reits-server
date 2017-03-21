const service = require('feathers-mongoose');
const tenant = require('./tenant-modal');
const hooks = require('./hooks');
const events = require('./events');

module.exports = function() {
  const app = this;
  const options = app.get('service');
  options['Model'] = tenant;

  app.use('/tenants', service(options));

  const tenantService = app.service('/tenants');

  tenantService.before(hooks.before);
  tenantService.after(hooks.after);

  events(tenantService);
};
