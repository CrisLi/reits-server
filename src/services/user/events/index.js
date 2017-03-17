module.exports = (service, app) => {
  service.on('created', user => (
    app.logger.info(`User [${user.username}] created.`)
  ));
};
