const errors = require('feathers-errors');

module.exports = (options = { reits: false }) => (
  (hook) => {
    const { params: { user, query }, app: { logger } } = hook;

    // If it was a no user call then skip this hook
    if (user === undefined) {
      return hook;
    }

    const { tenantId } = user;

    if (tenantId === 'reits') {
      logger.debug(`No restrict to any tenants for user [${user.email}].`);
      return hook;
    }

    // Only reits tenant user can do this request
    if (options.reits) {
      throw new errors.Forbidden('You do not have the permissions to access this.');
    }

    logger.debug(`Restrict to tenant [${tenantId}] for user [${user.email}].`);

    query.tenantId = user.tenantId;

    return hook;
  }
);
