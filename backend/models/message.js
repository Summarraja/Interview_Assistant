const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  receiver: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  content: { type: String },
  file:{type:String,default:''},
  time : { type : Date, default: Date.now() },
  chat: { type: mongoose.Types.ObjectId, required: true, ref: 'Chat' },
});

module.exports = mongoose.model('Message', messageSchema);
