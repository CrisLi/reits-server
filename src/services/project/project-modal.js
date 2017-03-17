const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Public', 'Private'],
    required: true
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Done'],
    required: true,
    default: 'New'
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    parceNumber: {
      type: String,
      default: ''
    },
    zoning: {
      type: String,
      default: ''
    }
  },
  description: {
    type: String,
    default: ''
  },
  tenantId: {
    type: String,
    ref: 'Tenant',
    required: true,
    index: 1
  }
}, {
  timestamps: true
});

projectSchema.index({
  name: 1,
  tenantId: 1
}, {
  unique: true
});

const projectModel = mongoose.model('project', projectSchema);

module.exports = projectModel;
