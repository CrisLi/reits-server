module.exports = getTenantId => (
  (hook) => {
    const { app } = hook;
    const tenantService = app.service('/tenants');
    return new Promise((resolve, reject) => {
      tenantService.get(getTenantId(hook))
        .then(() => resolve(hook))
        .catch(reject);
    });
  }
);
