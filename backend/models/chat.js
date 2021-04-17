const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  with: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  from: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  messages: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Message' }],
  lastMessageId: {type: mongoose.Types.ObjectId, required: true, ref: 'Message' },
  lastMessageDate:{type:String}
});

module.exports = mongoose.model('Chat', chatSchema);
