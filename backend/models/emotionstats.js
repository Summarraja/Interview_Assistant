const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const emotionStatsSchema = new Schema({
    candidate: { type: mongoose.Types.ObjectId, required: true , ref:"User"},
    interview: { type: mongoose.Types.ObjectId, required: true , ref:"Interview"},
    type:{type:String,enum: ['facial', 'vocal'],required:true},
    emotions:[{type:Number, enum:[0,1,2,3,4,5,6]}]
});

module.exports = mongoose.model('EmotionStats', emotionStatsSchema);
