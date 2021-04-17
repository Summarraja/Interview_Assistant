const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Message = require('../models/message');
const Chat = require('../models/chat');

const getMessageById = async (req, res, next) => {
    const messageid = req.params.mid;
    let message;
    try {
        message = await Message.findById(messageid);
    } catch (err) {
        // console.log(err)
        const error = new HttpError(
            'Something went wrong, could not find a message.',
            500
        );
        return next(error);
    }

    if (!message) {
        const error = new HttpError(
            'Could not find message for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ message: message.toObject({ getters: true }) });
};

const getMessagesByChatId = async (req, res, next) => {
    const chatId = req.params.cid;
    let messages;
    try {
        messages = await Message.find({chat:chatId});
    } catch (err) {
        const error = new HttpError(
            'Fetching messages failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!messages) {
        return next(
            new HttpError('Could not find messages for the provided chat id.', 404)
        );
    }
    if (messages.length === 0) {
        res.json({
            messages: []
        });
    }
    else {
    res.json({
        messages: messages.map(message =>
            message.toObject({ getters: true })
        )
    });
}

};

const createInterview = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { title, description, date, time, fieldTitle } = req.body;

    let field;
    try {
        field = await Field.findOne({ title: fieldTitle });
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

    const createdInterview = new Message({
        title,
        description,
        date,
        time,
        field: field.id,
        creator: req.userData.userId,
        candidates: [],
        sentRequests: [],
        receivedRequests: [],
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
            'Creating message failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ Message: createdInterview });
};

const deleteInterview = async (req, res, next) => {
    const interviewId = req.params.iid;

    let message;
    try {
        message = await Message.findById(interviewId).populate('creator');

    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete message.',
            500
        );
        return next(error);
    }

    if (!message) {
        const error = new HttpError('Could not find message for this id.', 404);
        return next(error);
    }

    if (message.creator.id !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to delete this message.',
            401
        );
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await message.remove({ session: sess });
        message.creator.createdInterviews.pull(message.id);
        await message.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete message.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted message.' });
};



exports.getMessageById = getMessageById;
exports.getMessagesByChatId = getMessagesByChatId;

