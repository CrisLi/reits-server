module.exports = (service) => {
  service.on('created', (user, hook) => {
    const { app } = hook;
    if (user.tenantId === 'client') {
      app.logger.info(`User [${user.username}] registered.`);
    } else {
      app.logger.info(`User [${user.username}] created.`);
    }
  });
};
