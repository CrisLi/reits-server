module.exports = (service) => {
  service.on('created', (project, hook) => {
    const { params: { user, tenantId }, app } = hook;
    app.logger.info(`Project [${project.name}] created by [${user.username}] in tenant [${tenantId}].`);
  });
};
