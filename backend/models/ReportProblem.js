const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReportProblemSchema = new Schema({
  title: { type: String, required: true },
  answer: { type: String },
  description: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
 
});

module.exports = mongoose.model('ReportProblem', ReportProblemSchema);
