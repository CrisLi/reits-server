module.exports = (app) => {
  app.logger.info('clean up database');

  const userService = app.service('/users');
  const tenantService = app.service('/tenants');

  const p1 = userService.remove(null, { query: { email: { $ne: 'admin@reits.com' } } });
  const p2 = tenantService.remove(null, { query: { _id: { $nin: ['reits', 'client'] } } });

  return Promise.all([p1, p2]);
};
