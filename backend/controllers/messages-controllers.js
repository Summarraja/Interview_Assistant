const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Message = require('../models/message');
const Chat = require('../models/chat');
const User = require('../models/user');
const { ObjectID } = require('bson');

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
        messages = await Message.find({ chat: chatId });
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

const createMessage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { sender, receiver, content } = req.body;

    let senderUser;
    try {
        senderUser = await User.findById(sender).populate('resume');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a sender.',
            500
        );
        return next(error);
    }

    if (!senderUser) {
        const error = new HttpError(
            'Could not find sender for the provided id.',
            404
        );
        return next(error);
    }

    let receiverUser;
    try {
        receiverUser = await User.findById(receiver).populate('resume');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a receiver.',
            500
        );
        return next(error);
    }

    if (!receiverUser) {
        const error = new HttpError(
            'Could not find receiver for the provided id.',
            404
        );
        return next(error);
    }
    let chat;
    try {
        chat = await Chat.findOne({ with: sender, from: receiver });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a chat.',
            500
        );
        return next(error);
    }
    if (!chat) {
        try {
            chat = await Chat.findOne({ with: receiver, from: sender });
        } catch (err) {
            const error = new HttpError(
                'Something went wrong, could not find a chat 2.',
                500
            );
            return next(error);
        }
    }

    let createdMessage;

    if (chat) {
        createdMessage = new Message({
            sender,
            receiver,
            content,
            time: Date.now(),
            chat: chat.id
        });

        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await createdMessage.save({ session: sess });
            chat.lastMessage = content;
            if(sender==chat.with){
                chat.withUnread=0;
                chat.fromUnread=chat.fromUnread+1;
            }else{
                chat.withUnread=chat.withUnread+1;
                chat.fromUnread=0;
            }
            chat.lastMessageTime=Date.now();
            await chat.save({ session: sess });
            await sess.commitTransaction();
        } catch (err) {
            const error = new HttpError(
                'Creating message failed, please try again.',
                500
            );
            return next(error);
        }

        res.status(201).json({ Message: createdMessage });
    }

    if (!chat) {
        const mid = new ObjectID();
        const cid = new ObjectID();

        createdMessage = new Message({
            _id: mid,
            sender,
            receiver,
            content,
            time: Date.now(),
            chat: cid
        });
        const createdChat = new Chat({
            _id: cid,
            with: receiver,
            withUnread:1,
            withName:receiverUser.resume.fullname,
            from: sender,
            fromName:senderUser.resume.fullname,
            lastMessage:content,
            lastMessageTime:Date.now()
            
        });
        senderUser.chats.push(createdChat)
        receiverUser.chats.push(createdChat)
        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await createdMessage.save({ session: sess });
            await createdChat.save({ session: sess });
            await receiverUser.save({ session: sess });
            await senderUser.save({ session: sess });
            await sess.commitTransaction();
        } catch (err) {
            console.log(err)
            const error = new HttpError(
                'Creating message failed, please try again.',
                500
            );
            return next(error);
        }

        res.status(201).json({ Message: createdMessage });
    }
};

const deleteMessage = async (req, res, next) => {
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
exports.createMessage = createMessage;
