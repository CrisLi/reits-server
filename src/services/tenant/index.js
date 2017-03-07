const service = require('feathers-mongoose');
const tenant = require('./tenant-modal');
// const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: tenant,
    paginate: {
      default: 5,
      max: 25
    }
  };

  app.use('/tenants', service(options));

  // const tenantService = app.service('/tenant');
};
