const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Interview = require('../models/interview');
const Field  = require('../models/field');
const User = require('../models/user');

const getInterviewById = async (req, res, next) => {
    const interviewId = req.params.iid;

    let interview;
    try {
        interview = await Interview.findById(interviewId);
    } catch (err) {
        console.log(err)
        const error = new HttpError(
            'Something went wrong, could not find a interview.',
            500
        );
        return next(error);
    }

    if (!interview) {
        const error = new HttpError(
            'Could not find interview for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ interview: interview.toObject({ getters: true }) });
};

const getInterviewsByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let userWithInterviews;
    try {
        userWithInterviews = await User.findById(userId).populate('createdInterviews');
    } catch (err) {
        const error = new HttpError(
            'Fetching interviews failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!userWithInterviews) {
        return next(
            new HttpError('Could not find interviews for the provided user id.', 404)
        );
    }
    res.json({
        interviews: userWithInterviews.createdInterviews.map(interview =>
            interview.toObject({ getters: true })
        )
    });
};

const createInterview = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { title, description, date, time , fieldTitle } = req.body;

    let field;
    try {
        field = await Field.findOne({title:fieldTitle});
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a field.',
            500
        );
        return next(error);
    }

     console.log("created field: " + field)
    if (!field) {
        const error = new HttpError(
            'Could not find field for the provided title.',
            404
        );
        return next(error);
    }

    const createdInterview = new Interview({
        title,
        description,
        date,
        time,
        field: field.id,
        creator: req.userData.userId,
        candidates:[],
        sentRequests:[],
        receivedRequests:[],
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError(
            'Finding user failed, please try again.',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdInterview.save({ session: sess });
        user.createdInterviews.push(createdInterview);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Creating interview failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ Interview: createdInterview });
};

const updateInterview = async (req, res, next) => {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { title, description, date, time , fieldTitle, isCancelled } = req.body;

    let field;
    try {
        field = await Field.findOne({title:fieldTitle});
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a field.',
            500
        );
        return next(error);
    }
    if (!field) {
        const error = new HttpError(
            'Could not find field for the provided title.',
            404
        );
        return next(error);
    }
    const interviewId = req.params.iid;

    let interview;
    try {
        interview = await Interview.findById(interviewId);
    } catch (err) {
        
        const error = new HttpError(
            'could not find interview of specified id.',
            500
        );
        return next(error);
    }
    if (!interview) {
        const error = new HttpError(
            'Could not find interview for the provided id.',
            404
        );
        return next(error);
    }
    if (interview.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this interview.', 401);
        return next(error);
    }

    interview.title = title;
    interview.description = description;
    interview.date = date;
    Interview.time = time;
    interview.field = field.id;
    interview.isCancelled = isCancelled;

    try {
        await interview.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Something went wrong, could not update interview.',
            500
        );
        return next(error);
    }

    res.status(200).json({ interview: interview.toObject({ getters: true }) });
};

const deleteInterview = async (req, res, next) => {
    const interviewId = req.params.iid;

    let interview;
    try {
        interview = await Interview.findById(interviewId).populate('creator');
       
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete interview.',
            500
        );
        return next(error);
    }

    if (!interview) {
        const error = new HttpError('Could not find interview for this id.', 404);
        return next(error);
    }

    if (interview.creator.id !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to delete this interview.',
            401
        );
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await interview.remove({ session: sess });
        interview.creator.createdInterviews.pull(interview.id);
        await interview.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete interview.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted interview.' });
};

const addCandidate = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { uid } = req.body;

    let candidate;
    try {
        candidate = await User.findById(uid);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a User.',
            500
        );
        return next(error);
    }

    if (!candidate) {
        const error = new HttpError(
            'Could not find candidate for the provided id.',
            404
        );
        return next(error);
    }
    const interviewId = req.params.iid;

    let interview;
    try {
        interview = await Interview.findById(interviewId);
    } catch (err) {
        const error = new HttpError(
            'Could not find interview of specified id.',
            500
        );
        return next(error);
    }
    if (!interview) {
        const error = new HttpError(
            'Could not find interview for the provided id.',
            404
        );
        return next(error);
    }
    if (interview.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this interview.', 401);
        return next(error);
    }

    const added = interview.candidates.addToSet(candidate);
    if (added.length<1) {
        const error = new HttpError('Candidate is already added to the interview.', 401);
        return next(error);
    }

    try {
        await interview.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not add candidate to interview.',
            500
        );
        return next(error);
    }

    res.status(200).json({ interview: interview.toObject({ getters: true }) });
};

const inviteCandidate = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { uid } = req.body;

    let candidate;
    try {
        candidate = await User.findById(uid);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a User.',
            500
        );
        return next(error);
    }

    if (!candidate) {
        const error = new HttpError(
            'Could not find candidate for the provided id.',
            404
        );
        return next(error);
    }
    const interviewId = req.params.iid;

    let interview;
    try {
        interview = await Interview.findById(interviewId);
    } catch (err) {
        const error = new HttpError(
            'Could not find interview of specified id.',
            500
        );
        return next(error);
    }
    if (!interview) {
        const error = new HttpError(
            'Could not find interview for the provided id.',
            404
        );
        return next(error);
    }
    if (interview.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this interview.', 401);
        return next(error);
    }

    interview.sentRequests.addToSet(candidate.id);
    candidate.receivedRequests.addToSet(interview.id);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await interview.save({ session: sess });
        await candidate.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not send request to the Candidate for interview.',
            500
        );
        return next(error);
    }


    // try {
    //     await interview.save();
    // } catch (err) {
    //     const error = new HttpError(
    //         'Something went wrong, could not send request to the Candidate for interview.',
    //         500
    //     );
    //     return next(error);
    // }

    res.status(201).json({ interview: interview.toObject({ getters: true }) });
};

const removeCandidate = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { uid } = req.body;

    let candidate;
    try {
        candidate = await User.findById(uid);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a User.',
            500
        );
        return next(error);
    }

    if (!candidate) {
        const error = new HttpError(
            'Could not find candidate for the provided id.',
            404
        );
        return next(error);
    }
    const interviewId = req.params.iid;

    let interview;
    try {
        interview = await Interview.findById(interviewId);
    } catch (err) {
        const error = new HttpError(
            'Could not find interview of specified id.',
            500
        );
        return next(error);
    }
    if (!interview) {
        const error = new HttpError(
            'Could not find interview for the provided id.',
            404
        );
        return next(error);
    }
    if (interview.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this interview.', 401);
        return next(error);
    }
    if (!interview.candidates.includes(candidate.id)) {
        const error = new HttpError('Candidate is already not added in the interview.', 401);
        return next(error);
    }
    interview.candidates.pull(candidate);

    try {
        await interview.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not remove candidate from interview.',
            500
        );
        return next(error);
    }

    res.status(200).json({ interview: interview.toObject({ getters: true }) });
};

exports.getInterviewById = getInterviewById;
exports.getInterviewsByUserId = getInterviewsByUserId;
exports.createInterview = createInterview;
exports.updateInterview = updateInterview;
exports.deleteInterview = deleteInterview;
exports.addCandidate = addCandidate;
exports.removeCandidate = removeCandidate;
exports.inviteCandidate = inviteCandidate;
