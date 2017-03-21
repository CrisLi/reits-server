module.exports = (service) => {
  service.on('created', (tenant, hook) => (
    hook.app.logger.info(`Tenant [${tenant['_id']}] created.`)
  ));
};
