const service = require('feathers-mongoose');
const tenant = require('./tenant-modal');
const hooks = require('./hooks');
const events = require('./events');
const init = require('./init');

module.exports = function() {
  const app = this;
  const {
    paginate
  } = app.get('service');
  const options = {
    Model: tenant,
    paginate,
    overwrite: false
  };

  app.use('/tenants', service(options));

  const tenantService = app.service('/tenants');

  tenantService.before(hooks.before);
  tenantService.after(hooks.after);

  events(tenantService, app);

  init(app);
};
