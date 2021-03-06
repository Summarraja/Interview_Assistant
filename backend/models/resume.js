const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resumeSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  dob: { type: String, required: true },
  image: { type: String },
  phone: { type: String },
  email: { type: String },
  country: {type:String},
  city: { type: String },
  address: {type:String},
  gender: {type:String},
  maxEducation: { type: String},
  experience: { type: Number },
  user: { type: mongoose.Types.ObjectId,  ref: 'User' },
  field: { type: mongoose.Types.ObjectId,  ref: 'Field' }
});

module.exports = mongoose.model('Resume', resumeSchema);
