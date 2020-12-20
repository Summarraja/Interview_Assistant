const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const callSchema = new Schema({
  sender: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  receiver: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  time: { type: Date, default:Date.now },
  duration: { type: Number, required:true },
  type: { type: String,enum:["voice","video"], required:true },
  status: { type: String,enum:["received","missed"], required:true },
});

module.exports = mongoose.model('Call', callSchema);
