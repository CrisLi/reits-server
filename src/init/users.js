module.exports = (app) => {
  const superAdmin = {
    email: 'admin@reits.com',
    password: 'helloreits!',
    role: ['Admin'],
    displayName: 'admin',
  };
  const userService = app.service('/users');
  const tenantService = app.service('/tenants');

  const params = {
    query: {
      $limit: 1,
      slug: 'reits'
    }
  };

  return tenantService
    .find(params)
    .then(({ total, data }) => {
      if (total === 0) {
        throw new Error('Admin tenant has not been init yet.');
      } else {
        superAdmin['tenantId'] = data[0]['_id'];
        return userService.create(superAdmin);
      }
    })
    .catch((err) => {
      if (err.code !== 409) {
        throw err;
      }
    });
};
