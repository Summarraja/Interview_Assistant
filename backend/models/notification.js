const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    message: {type: String},
    time : { type : Date, default: Date.now() },
    to: {type: Schema.Types.ObjectId,ref: 'User'},
  });

module.exports = mongoose.model('Notification', notificationSchema);
