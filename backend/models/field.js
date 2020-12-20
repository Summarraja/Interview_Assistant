const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fieldSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skils: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Skill' }]
});

module.exports = mongoose.model('Field', fieldSchema);
