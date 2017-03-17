const collections = ['/projects'];

module.exports = (app) => {
  const createTenant = (tenant) => {
    const tenantService = app.service('/tenants');
    return tenantService.create(tenant);
  };

  const clean = () => {
    app.logger.info('clean up database');

    const userService = app.service('/users');
    const tenantService = app.service('/tenants');

    const p1 = userService.remove(null, { query: { username: { $ne: 'admin@reits' } } });
    const p2 = tenantService.remove(null, { query: { _id: { $nin: ['reits', 'client'] } } });
    const others = collections.map((path) => {
      const service = app.service(path);
      return service.remove(null);
    });

    return Promise.all([p1, p2, ...others]);
  };

  return {
    clean,
    createTenant
  };
};
