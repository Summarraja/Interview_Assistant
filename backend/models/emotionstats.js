const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const emotionStatsSchema = new Schema({
    candidate: { type: mongoose.Types.ObjectId, required: true , ref:"User"},
    interview: { type: mongoose.Types.ObjectId, required: true , ref:"Interview"},
    type:{type:String,enum: ['facial', 'vocal'],required:true},
    happyCount: { type: Number, default: 0 },
    sadCount: { type: Number, default: 0 },
    angryCount: { type: Number, default: 0 },
    neutralCount: { type: Number, default: 0 },
    disgustCount: { type: Number, default: 0 },
    surpriseCount: { type: Number, default: 0 },
    fearCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('EmotionStats', emotionStatsSchema);
