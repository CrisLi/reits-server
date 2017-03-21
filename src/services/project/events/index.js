module.exports = (service) => {
  service.on('created', (project, hook) => {
    const { user, tenantId } = hook.params;
    hook.app.logger.info(`Project [${project.name}] created by [${user.username}] in tenant [${tenantId}].`);
  });
};
