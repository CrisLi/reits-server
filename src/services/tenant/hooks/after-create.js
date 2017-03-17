const admin = tenantId => ({
  username: 'admin',
  password: 'admin123456',
  roles: ['Admin'],
  displayName: 'admin',
  tenantId
}); // TODO put this into the config file

module.exports = () => (hook) => {
  const { result, app } = hook;

  // For the Provider, we will create a default admin user for them.
  if (result.type === 'Provider') {
    const userService = app.service('/users');
    const tenantId = result['_id'];
    const user = admin(tenantId);
    app.logger.info(`Creating admin user for tenant [${tenantId}].`);
    return userService.create(user).then(() => hook);
  }

  return hook;
};
