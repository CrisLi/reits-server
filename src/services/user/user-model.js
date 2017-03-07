// user-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  displayName: {
    type: String
  },
  role: {
    enum: ['Admin', 'PM', 'FA', 'Finance', 'User']
  }
}, {
  timestamps: true
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
