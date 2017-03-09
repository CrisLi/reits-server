module.exports = (app) => {
  const admin = {
    _id: 'reits',
    name: 'reits',
    type: 'Admin',
    description: 'The reits admin tenant to manage service providers.'
  };
  const client = {
    _id: 'client',
    name: 'client',
    type: 'Client',
    description: 'The client tenant for all client users.'
  };

  const createTenant = (data) => {
    const tenantService = app.service('/tenants');

    return tenantService
      .create(data)
      .catch((err) => {
        if (err.code !== 409) {
          throw err;
        }
        return data;
      });
  };

  return Promise.all([createTenant(admin), createTenant(client)]);
};
