const authentication = require('./authentication');
const tenant = require('./tenant');
const user = require('./user');
const mongoose = require('mongoose');

module.exports = function() {
  const app = this;

  mongoose.connect(app.get('mongodb'));
  mongoose.Promise = global.Promise;

  app.configure(authentication);
  app.configure(tenant);
  app.configure(user);
};
