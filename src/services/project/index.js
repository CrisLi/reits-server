const service = require('feathers-mongoose');
const project = require('./project-modal');
const hooks = require('./hooks');
const events = require('./events');

module.exports = function() {
  const app = this;
  const options = app.get('service');
  options['Model'] = project;

  app.use('/projects', service(options));

  const projectService = app.service('/projects');

  projectService.before(hooks.before);
  projectService.after(hooks.after);

  events(projectService, app);
};
