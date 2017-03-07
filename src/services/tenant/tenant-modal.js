const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tenantSchema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['Admin', 'Client', 'Provider'],
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, { timestamps: true });

const tenantModel = mongoose.model('tenant', tenantSchema);

module.exports = tenantModel;
