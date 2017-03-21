const errors = require('feathers-errors');

const adminTenant = (hook) => {
  const { params: { user }, app: { logger } } = hook;
  logger.debug(`No restrict to any tenants for user [${user.username}].`);
  return hook;
};

const clientTenant = (hook) => {
  const { params: { user }, app: { logger } } = hook;
  logger.debug(`Not implement tenant restriction for client user [${user.username}] yet.`);
  return hook;
};

const providerTenant = (hook, options) => {
  // Only reits tenant user can do this request
  if (options.reits) {
    throw new errors.Forbidden('You do not have the permissions to access this.');
  }

  const { params: { user, query }, app: { logger } } = hook;

  logger.debug(`Restrict to tenant [${user.tenantId}] for user [${user.username}].`);

  query.tenantId = user.tenantId;

  return hook;
};

module.exports = (options = { reits: false, setData: false }) => (
  (hook) => {
    const { params: { user } } = hook;

    // If it was a no user call then skip this hook
    if (user === undefined) {
      return hook;
    }

    switch (user.tenantId) {
      case 'reits':
        return adminTenant(hook, options);
      case 'client':
        return clientTenant(hook, options);
      default:
        return providerTenant(hook, options);
    }
  }
);
