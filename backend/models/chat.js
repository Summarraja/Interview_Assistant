const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  with: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  withName:{type:String,required:true},
  withUnread:{type:Number,required:true,default:0},
  from: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  fromName:{type:String,required:true},
  fromUnread:{type:Number,required:true,default:0},
  lastMessage:{type:String,required:true},
  lastMessageTime:{type:Date,required:true}
});

module.exports = mongoose.model('Chat', chatSchema);
