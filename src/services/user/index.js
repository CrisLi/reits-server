const service = require('feathers-mongoose');
const user = require('./user-model');
const hooks = require('./hooks');
const events = require('./events');

module.exports = function() {
  const app = this;

  const {
    paginate
  } = app.get('service');
  const options = {
    Model: user,
    paginate,
    overwrite: false
  };

  app.use('/users', service(options));

  const userService = app.service('/users');

  userService.before(hooks.before);
  userService.after(hooks.after);

  events(userService, app);
};
