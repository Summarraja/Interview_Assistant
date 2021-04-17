const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Chat = require('../models/chat');
const User = require('../models/user');

const getChatsByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let userWithChats;
    try {
        userWithChats = await Chat.find({from:userId});
    } catch (err) {
        const error = new HttpError(
            'Fetching chats failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!userWithChats) {
        return next(
            new HttpError('Could not find chats for the provided user id.', 404)
        );
    }
    if (userWithChats.length === 0) {
        res.json({
            chats: []
        });
    }
    else {
    res.json({
        chats: userWithChats.map(chat =>
            chat.toObject({ getters: true })
        )
    });
}

};


const deleteChat = async (req, res, next) => {
    const chatid = req.params.iid;

    let chat;
    try {
        chat = await Chat.findById(chatid).populate('from');

    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete chat.',
            500
        );
        return next(error);
    }

    if (!chat) {
        const error = new HttpError('Could not find chat for this id.', 404);
        return next(error);
    }

    if (chat.from.id !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to delete this chat.',
            401
        );
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await chat.remove({ session: sess });
        chat.from.chats.pull(chat.id);
        await chat.from.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete chat.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted chat.' });
};

exports.getChatsByUserId = getChatsByUserId;
exports.deleteChat = deleteChat;

