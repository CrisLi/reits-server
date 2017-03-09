const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tenantSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Admin', 'Client', 'Provider'],
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  _id: false
});

const tenantModel = mongoose.model('tenant', tenantSchema);

module.exports = tenantModel;
