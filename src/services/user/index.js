const service = require('feathers-mongoose');
const user = require('./user-model');
const hooks = require('./hooks');
const events = require('./events');

module.exports = function() {
  const app = this;

  const options = app.get('service');
  options['Model'] = user;

  app.use('/users', service(options));

  const userService = app.service('/users');

  userService.before(hooks.before);
  userService.after(hooks.after);

  events(userService, app);
};
