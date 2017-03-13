const errors = require('feathers-errors');
/*
  only reits user can create users to each other tenants.
*/
module.exports = () => (hook) => {
  const { data: { tenantId }, params: { user, provider } } = hook;
  if (!provider) {
    return hook;
  }
  if (user === undefined) {
    // this is client user registration.
    return hook;
  }
  if (user.tenantId === 'reits') {
    return hook;
  }
  if (tenantId !== user.tenantId) {
    throw new errors.Forbidden(`You do not have valid permissions to access this tenant [${tenantId}].`, { errors: { tenantId } });
  }
  return hook;
};
