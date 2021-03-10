const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const interviewSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
<<<<<<< Updated upstream
  time: { type: String, required: true},
=======
 
>>>>>>> Stashed changes
  isCancelled:{type:Boolean,default:false},
  field:{type:mongoose.Types.ObjectId,required:true,ref:"Field"},
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  candidates: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  sentRequests: [{ type: mongoose.Types.ObjectId,  ref: 'User' }],
  receivedRequests: [{ type: mongoose.Types.ObjectId,  ref: 'User' }]
});

module.exports = mongoose.model('Interview', interviewSchema);