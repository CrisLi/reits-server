const errors = require('feathers-errors');

module.exports = (options = {}) => (
  (hook) => {
    const { params: { user, query }, app: { logger }, data } = hook;

    // If it was a no user call then skip this hook
    if (user === undefined) {
      return hook;
    }

    const { tenantId } = user;

    if (tenantId === 'reits') {
      logger.debug(`No restrict to any tenants for user [${user.email}].`);
      return hook;
    }

    logger.debug(`Restrict to tenant [${tenantId}] for user [${user.email}].`);

    const { tenantField = 'tenantId' } = options;

    if (hook.params.provider && data[tenantField] !== tenantId) {
      throw new errors.Forbidden(`You do not have valid permissions to access this tenant [${tenantId}].`, { errors: { tenantId } });
    }

    query.tenantId = user.tenantId;

    return hook;
  }
);
