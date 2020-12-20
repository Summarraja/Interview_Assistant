const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const emotionStatsSchema = new Schema({
    candidate: { type: mongoose.Types.ObjectId, required: true , ref:"User"},
    interview: { type: mongoose.Types.ObjectId, required: true , ref:"Interview"},
    facialHappyCount: { type: Number, default: 0 },
    facialSadCount: { type: Number, default: 0 },
    facialAngryCount: { type: Number, default: 0 },
    facialNeutralCount: { type: Number, default: 0 },
    facialDisgustCount: { type: Number, default: 0 },
    facialSurpriseCount: { type: Number, default: 0 },
    facialFearCount: { type: Number, default: 0 },
    vocalHappyCount: { type: Number, default: 0 },
    vocalSadCount: { type: Number, default: 0 },
    vocalAngryCount: { type: Number, default: 0 },
    vocalNeutralCount: { type: Number, default: 0 },
    vocalDisgustCount: { type: Number, default: 0 },
    vocalSurpriseCount: { type: Number, default: 0 },
    vocalFearCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('EmotionStats', emotionStatsSchema);
