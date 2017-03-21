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

const populateForProvider = (hook) => {
  const { params, data } = hook;
  params.tenantId = params.user.tenantId;
  if (data) {
    data.tenantId = params.tenantId;
  }
  return hook;
};

const populateForAdmin = (hook) => {
  const { params, data } = hook;
  if (data && data.tenantId) {
    params.tenantId = data.tenantId;
  }
  return tenantExists(hook);
};

module.exports = () => (hook) => {
  const { params: { user } } = hook;

  if (user === undefined) {
    return hook;
  }

  switch (user.tenantId) {
    case 'reits':
      return populateForAdmin(hook);
    case 'client':
      return hook;
    default:
      return populateForProvider(hook);
  }
};
