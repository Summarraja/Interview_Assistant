const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const EmotionStats = require('../models/emotionstats');
const Interview = require('../models/interview');
const User = require('../models/user');

const getEmotionStatsbyInterviewId = async (req, res, next) => {
    const interviewId = req.params.iid;

    let emotions;
    try {
        emotions = await EmotionStats.find({ interview: interviewId });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find emotions',
            500
        );
        return next(error);
    }

    if (!emotions) {
        const error = new HttpError(
            'Could not find emotions for the provided interview id.',
            404
        );
        return next(error);
    }
    res.json({
        emotions: emotions.map(emotion =>
            emotion.toObject({ getters: true })
        )
    });
};

const createOrUpdateEmotionStats = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const { interview, candidate, type, happyCount, sadCount, angryCount, neutralCount, disgustCount, surpriseCount, fearCount } = req.body;

    let emotions;
    try {
        emotions = await EmotionStats.findOne({ interview: interview, candidate: candidate, type: type });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find emotions',
            500
        );
        return next(error);
    }

    if (emotions) {
        emotions.happyCount = emotions.happyCount + happyCount;
        emotions.sadCount = emotions.sadCount + sadCount;
        emotions.angryCount = emotions.angryCount + angryCount;
        emotions.neutralCount = emotions.neutralCount + neutralCount;
        emotions.disgustCount = emotions.disgustCount + disgustCount;
        emotions.surpriseCount = emotions.surpriseCount + surpriseCount;
        emotions.fearCount = emotions.fearCount + fearCount;
        try{
            await emotions.save();
        }
        catch(err){
            const error = new HttpError(
                'Updating Emotions failed, please try again.',
                500
            );
            return next(error);
        }
        res.status(201).json({ emotions: emotions });

    }
    if(!emotions){
        let existingInterview;
        try {
            existingInterview = await Interview.findById(interview);
        } catch (err) {
            const error = new HttpError(
                'Something went wrong, could not find interview',
                500
            );
            return next(error);
        }
        if(!existingInterview){
            const error = new HttpError(
                'Could not find interview for the provided Id',
                500
            );
            return next(error);
        }
        if(existingInterview.time<Date.now()){
            const error = new HttpError(
                'Could not create emotions for the interview that is taken',
                500
            );
            return next(error);
        }
        let existingCandidate;
        try {
            existingCandidate = await User.findById(candidate);
        } catch (err) {
            const error = new HttpError(
                'Something went wrong, could not find candidate',
                500
            );
            return next(error);
        }
        if(!existingCandidate){
            const error = new HttpError(
                'Could not find candidate for the provided Id',
                500
            );
            return next(error);
        }
        const createdEmotions = new EmotionStats({
            interview,
            candidate,
            type,
            happyCount,
            sadCount,
            angryCount,
            neutralCount,
            disgustCount,
            surpriseCount,
            fearCount
        });
    
        try {
            await createdEmotions.save();
        } catch (err) {
            const error = new HttpError(
                'Creating Emotions failed, please try again.',
                500
            );
            return next(error);
        }
    
        res.status(201).json({ emotions: createdEmotions });
    
    }
};



exports.getEmotionStatsbyInterviewId = getEmotionStatsbyInterviewId
exports.createOrUpdateEmotionStats = createOrUpdateEmotionStats