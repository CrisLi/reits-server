const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  target: {
    type: {
      type: String,
      required: true
    },
    data: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  createdBy: {
    _id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  comments: {
    type: String,
    default: ''
  },
  tenantId: {
    type: String,
    required: true,
    index: 1
  }
}, {
  timestamps: true
});

const eventModel = mongoose.model('event', eventSchema);

module.exports = eventModel;
