const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const EmotionStats = require('../models/emotionstats');
const Interview = require('../models/interview');
const User = require('../models/user');

const getEmotionStatsbyInterviewId = async (req, res, next) => {
    const interviewId = req.params.iid;
    const candidateId = req.params.cid;
    let stats;
    try {
        stats = await EmotionStats.find({ interview: interviewId, candidate:candidateId });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find emotions',
            500
        );
        return next(error);
    }

    if (!stats) {
        const error = new HttpError(
            'Could not find emotions for the provided interview id.',
            404
        );
        return next(error);
    }
    res.json({
        stats: stats.map(stat =>
            stat.toObject({ getters: true })
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
    const { interview, candidate, type, emotions } = req.body;

    let stats;
    try {
        stats = await EmotionStats.findOne({ interview: interview, candidate: candidate, type: type });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find emotions stats',
            500
        );
        return next(error);
    }

    if (stats) {
        stats.emotions = [...stats.emotions,...emotions];
        try{
            await stats.save();
        }
        catch(err){
            const error = new HttpError(
                'Updating Emotions failed, please try again.',
                500
            );
            return next(error);
        }
        res.status(200).json({ stats: stats });

    }
    else if(!stats){
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
        const createdStats = new EmotionStats({
            interview,
            candidate,
            type,
            emotions
        });
    
        try {
            await createdStats.save();
        } catch (err) {
            const error = new HttpError(
                'Creating Emotions failed, please try again.',
                500
            );
            return next(error);
        }

        res.status(200).json({ stats: createdStats });
    
    }
};



exports.getEmotionStatsbyInterviewId = getEmotionStatsbyInterviewId
exports.createOrUpdateEmotionStats = createOrUpdateEmotionStats