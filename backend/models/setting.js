const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const settingSchema = new Schema({
  notiStatus: {  type: Boolean, default: false },
  unreadChats:{type:Number,default:0},
  unreadNotis:{type:Number,default:0},
  status: { type: String, enum: ['busy', 'available','away'], default: 'available' },
  role: { type: String, enum: ['Admin', 'Interviewer','Candidate'], default: 'Candidate' },
  blockedUsers: [{ type: mongoose.Types.ObjectId, required: true , ref:'User'}],
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model('Setting', settingSchema);
