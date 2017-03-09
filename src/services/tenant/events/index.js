module.exports = (service, app) => {
  service.on('created', tenant => (
    app.logger.info(`Tenant [${tenant['_id']}] created.`)
  ));
};
