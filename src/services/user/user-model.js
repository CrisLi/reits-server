// user-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  tenantId: {
    type: String,
    ref: 'Tenant',
    required: true,
    index: 1
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    index: 1
  },
  password: {
    type: String,
    required: true
  },
  displayName: {
    type: String
  },
  roles: [{
    type: String,
    enum: ['Admin', 'PM', 'FA', 'Finance', 'Client']
  }]
}, {
  timestamps: true
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
