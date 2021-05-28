const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const fs = require('fs');

const HttpError = require('../models/http-error');
const Message = require('../models/message');
const Chat = require('../models/chat');
const User = require('../models/user');
const Resume = require('../models/resume');
const Setting = require('../models/setting');
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
    if (content.length == 0 && !req.file) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    let senderUser;
    try {
        senderUser = await User.findById(sender)
        .populate({path:'resume',model:Resume})
        .populate({path:'setting',model:Setting});
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
        receiverUser = await User.findById(receiver)
        .populate({path:'resume',model:Resume})
        .populate({path:'setting',model:Setting});
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
            content: content ? content : '',
            file: req.file ? req.file.path : '',
            time: Date.now(),
            chat: chat.id
        });

        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            chat.lastMessage = content ? content : 'image';
            if (sender == chat.with) {
                chat.withUnread = 0;
                chat.fromUnread = chat.fromUnread + 1;
            } else {
                chat.withUnread = chat.withUnread + 1;
                chat.fromUnread = 0;
            }
            chat.lastMessageTime = Date.now();
            receiverUser.setting.unreadChats = receiverUser.setting.unreadChats + 1;
            await createdMessage.save({ session: sess });
            await receiverUser.setting.save({ session: sess });
            await chat.save({ session: sess });
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

    if (!chat) {
        const mid = new ObjectID();
        const cid = new ObjectID();

        createdMessage = new Message({
            _id: mid,
            sender,
            receiver,
            content: content ? content : '',
            file: req.file ? req.file.path : '',
            time: Date.now(),
            chat: cid
        });
        const createdChat = new Chat({
            _id: cid,
            with: receiver,
            withUnread: 1,
            withName: receiverUser.resume.fullname,
            withImage: receiverUser.resume.image,
            from: sender,
            fromName: senderUser.resume.fullname,
            fromImage: senderUser.resume.image,
            lastMessage: content ? content : 'image',
            lastMessageTime: Date.now()

        });
        senderUser.chats.push(createdChat)
        receiverUser.chats.push(createdChat)
        receiverUser.setting.unreadChats = 1;
        try {
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await createdMessage.save({ session: sess });
            await createdChat.save({ session: sess });
            await receiverUser.setting.save({ session: sess });
            await receiverUser.save({ session: sess });
            await senderUser.save({ session: sess });
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
};

const deleteMessage = async (req, res, next) => {
    const mid = req.params.mid;

    let message;
    try {
        message = await Message.findById(mid).populate('chat');

    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find message.',
            500
        );
        return next(error);
    }

    if (!message) {
        const error = new HttpError('Could not find message for this id.', 404);
        return next(error);
    }
    if (message.sender != req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to delete this message.',
            401
        );
        return next(error);
    }

    let lastMessage;
    try {
        lastMessage = await Message.find({ chat: message.chat }).sort({ $natural: -1 }).limit(2);

    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find lastmessage.',
            500
        );
        return next(error);
    }
    if (!lastMessage) {
        const error = new HttpError('Could not find lastmessage.', 404);
        return next(error);
    }
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        if (message.image)
            fs.unlink(message.image, err => {
                console.log(err);
            });
        if (message.id == lastMessage[0].id) {
            message.chat.lastMessage = lastMessage[1].content ? lastMessage[1].content : 'image';
            message.chat.lastMessageTime = lastMessage[1].time;
        } else {
            message.chat.lastMessage = lastMessage[0].content ? lastMessage[0].content : 'image';
            message.chat.lastMessageTime = lastMessage[0].time;
        }
        await message.chat.save({ session: sess });
        await message.remove({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err)
        const error = new HttpError(
            'Something went wrong, could not delete message.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: "message deleted" });
};

exports.getMessageById = getMessageById;
exports.getMessagesByChatId = getMessagesByChatId;
exports.createMessage = createMessage;
exports.deleteMessage = deleteMessage;
