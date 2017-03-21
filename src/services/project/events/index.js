module.exports = (service, app) => {
  service.on('created', (project, hook) => {
    const { user, tenantId } = hook.params;
    app.logger.info(`Project [${project.name}] created by [${user.username}] in tenant [${tenantId}].`);
  });
};
