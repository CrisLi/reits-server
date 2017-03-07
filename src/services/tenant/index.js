const service = require('feathers-mongoose');
const tenant = require('./tenant-modal');
const hooks = require('./hooks');

const initTenants = (app) => {
  const admin = {
    slug: 'reits',
    name: 'reits',
    type: 'Admin',
    description: 'The reits admin tenant to manage service providers.'
  };
  const client = {
    slug: 'client',
    name: 'client',
    type: 'Client',
    description: 'The client tenant for all client users.'
  };

  const createTenant = (data) => {
    const tenantService = app.service('/tenants');
    const params = {
      query: {
        $limit: 1,
        slug: data.slug
      }
    };

    tenantService
      .find(params)
      .then(({ total }) => {
        if (total === 0) {
          app.logger.info(`No ${data.name} tenant found, create one.`);
          tenantService.create(data);
        }
      });
  };

  createTenant(admin);
  createTenant(client);
};

module.exports = function() {
  const app = this;
  const {
    paginate
  } = app.get('service');
  const options = {
    Model: tenant,
    paginate
  };

  app.use('/tenants', service(options));

  const tenantService = app.service('/tenants');

  tenantService.before(hooks.before);

  initTenants(app);
};
