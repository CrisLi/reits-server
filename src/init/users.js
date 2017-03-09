module.exports = (app) => {
  const superAdmin = {
    email: 'admin@reits.com',
    password: 'helloreits!',
    roles: ['Admin'],
    displayName: 'admin',
    tenantId: 'reits'
  };

  const userService = app.service('/users');

  return userService
    .create(superAdmin)
    .catch((err) => {
      if (err.code !== 409) {
        throw err;
      }
    });
};
