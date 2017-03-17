const errors = require('feathers-errors');

const tenantExists = (hook) => {
  const { params: { tenantId }, app } = hook;
  if (tenantId === undefined) {
    return hook;
  }
  const tenantService = app.service('/tenants');
  return new Promise((resolve, reject) => {
    tenantService.get(tenantId)
      .then(() => resolve(hook))
      .catch(reject);
  });
};

const adminTenant = (hook) => {
  const { params: { user }, app: { logger } } = hook;
  logger.debug(`No restrict to any tenants for user [${user.email}].`);
  return tenantExists(hook);
};

const clientTenant = (hook) => {
  const { params: { user }, app: { logger } } = hook;
  logger.debug(`Not implement tenant restriction for client user [${user.email}] yet.`);
  return hook;
};

const providerTenant = (hook, options) => {
  // Only reits tenant user can do this request
  if (options.reits) {
    throw new errors.Forbidden('You do not have the permissions to access this.');
  }

  const { params: { user, query, tenantId }, app: { logger } } = hook;

  logger.debug(`Restrict to tenant [${user.tenantId}] for user [${user.email}].`);

  // Tenant Id is in the request url.
  if (tenantId && (tenantId !== user.tenantId)) {
    logger.debug(`User [${user.email}] can't access the resources of tenant [${tenantId}].`);
    throw new errors.Forbidden('You do not have the permissions to access this.');
  }

  query.tenantId = user.tenantId;

  return tenantExists(hook);
};

module.exports = (options = { reits: false }) => (
  (hook) => {
    const { params: { user } } = hook;

    // If it was a no user call then skip this hook
    if (user === undefined) {
      return hook;
    }

    switch (user.tenantId) {
      case 'reits':
        return adminTenant(hook);
      case 'client':
        return clientTenant(hook);
      default:
        return providerTenant(hook, options);
    }
  }
);
