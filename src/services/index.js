const authentication = require('./authentication');
const tenant = require('./tenant');
const user = require('./user');
const events = require('./events');
const projects = require('./project');
const mongoose = require('mongoose');

module.exports = function() {
  const app = this;

  mongoose.connect(app.get('mongodb'));
  mongoose.Promise = global.Promise;

  app.configure(authentication);
  app.configure(tenant);
  app.configure(projects);
  app.configure(user);
  app.configure(events);
};
