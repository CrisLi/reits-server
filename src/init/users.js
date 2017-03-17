module.exports = (app) => {
  const superAdmin = {
    username: 'admin',
    password: 'helloreits!',
    roles: ['Admin'],
    displayName: 'admin',
    tenantId: 'reits'
  };

  const userService = app.service('/users');
  const throwIfNot409 = (err) => {
    if (err.code !== 409) {
      throw err;
    }
  };

  return userService.create(superAdmin).catch(throwIfNot409);
};
