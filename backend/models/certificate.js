const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const certificateSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  institute: { type: String, required: true },
  isApproved: {type: Boolean,default: false},
  file: { type: String},
  field: { type: mongoose.Types.ObjectId, required: true ,ref: 'Field'},
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Certificate', certificateSchema);
