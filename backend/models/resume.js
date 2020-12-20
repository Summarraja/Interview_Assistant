const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resumeSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  image: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String, required: true },
  maxEducation: { type: String, required: true },
  experience: { type: Number, required: true },
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  field: { type: mongoose.Types.ObjectId, required: true, ref: 'Field' }
});

module.exports = mongoose.model('Resume', resumeSchema);
