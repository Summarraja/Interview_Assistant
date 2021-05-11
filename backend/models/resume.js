const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const resumeSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  fullname: {type:String, default:''},
  dob: { type: String, required: true },
  image: { type: String, default:'' },
  phone: { type: String, default:'' },
  email: { type: String , required:true},
  country: {type:String, default:''},
  city: { type: String , default:''},
  address: {type:String,default:''},
  gender: {type:String},
  maxEducation: { type: String},
  experience: { type: Number },
  user: { type: mongoose.Types.ObjectId,  ref: 'User' },
  field: { type: mongoose.Types.ObjectId,  ref: 'Field' }
});

module.exports = mongoose.model('Resume', resumeSchema);