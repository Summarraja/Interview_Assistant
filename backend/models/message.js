const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  receiver: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  content: { type: String, required: true },
  time : { type : Date, default: Date.now() },
  isRead: {type: Boolean,default: false},
  chat: { type: mongoose.Types.ObjectId, required: true, ref: 'Chat' },
});

module.exports = mongoose.model('Message', messageSchema);
