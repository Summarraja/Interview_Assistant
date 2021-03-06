const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  
  isAdmin:{type:Boolean,default:false},
  email_verified :{type: Boolean,default:false},
  email_verify_token:{type: String,default:''},
  password_reset_token:{type: String,default:''},
  reset_token_expired_at: { type: Date,default:null},
  createdInterviews: [{ type: mongoose.Types.ObjectId, required: true, ref: "Interview" }],
  sentRequests: [{ type: mongoose.Types.ObjectId, required: true, ref: "Interview" }],
  receivedRequests: [{ type: mongoose.Types.ObjectId, required: true, ref: "Interview" }],
  resume: { type: mongoose.Types.ObjectId, default:null, ref: "Resume" },
  setting: { type: mongoose.Types.ObjectId, default:null, ref: "Setting"},
  certificates: [{ type: mongoose.Types.ObjectId, required: true, ref: "Certificate" }],
  stats: [{ type: mongoose.Types.ObjectId, required: true, ref: "EmotionStats" }],
  chats: [{ type: mongoose.Types.ObjectId, required: true, ref: "Chat" }],
  calls: [{ type: mongoose.Types.ObjectId, required: true, ref: "Call" }],
  notifications: [{ type: mongoose.Types.ObjectId, required: true, ref: "Notification" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
