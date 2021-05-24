const fs = require('fs');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Certificate = require('../models/certificate');
const Setting = require('../models/setting');
const Field = require('../models/field');
const User = require('../models/user');
const Notification = require('../models/notification');
const socket = require('../RTC/socket-context');
const getCertificateById = async (req, res, next) => {
    const certificateId = req.params.cid;

    let certificate;
    try {
        certificate = await Certificate.findById(certificateId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a certificate.',
            500
        );
        return next(error);
    }

    if (!certificate) {
        const error = new HttpError(
            'Could not find certificate for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ certificate: certificate.toObject({ getters: true }) });
};

const getCertificatesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userWithCertificate;
    try {
        userWithCertificate = await User.findById(userId).populate('certificates');
    } catch (err) {
        const error = new HttpError(
            'Fetching certificates failed, please try again later.',
            500
        );
        return next(error);
    }

    // if (!places || places.length === 0) {
    if (!userWithCertificate ) {
        return next(
            new HttpError('Could not find certificates for the provided user id.', 404)
        );
    }

    res.json({
        certificate: userWithCertificate.certificates.map(certificate =>
            certificate.toObject({ getters: true })
        )
    });

};

const getAllCertificates = async (req, res, next) => {

    let certificates;
    try {
        certificates = await Certificate.find({isApproved: false});
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find all Certificates.',
            500
        );
        return next(error);
    }

    if (!certificates) {
        const error = new HttpError(
            'Could not find Certificates.',
            404
        );
        return next(error);
    }

    res.json({
        certificates: certificates.map(certificate =>
            certificate.toObject({ getters: true })
        )
    });
};

const createCertificate = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { title, description, institute, fieldTitle } = req.body;

    let field;
    try {
        field = await Field.findOne({title: fieldTitle});
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
    const createdCertificate = new Certificate({
        title,
        description,
        institute,
        isApproved: false,
        field: field.id,
        file: req.file?req.file.path:'',
        creator: req.userData.userId
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
        user.certificates.push(createdCertificate);
        await createdCertificate.save({session:sess});
        await user.save({session:sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Creating certificate failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ certificate: createdCertificate });
};

const updateCertificate = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { title, description, institute, fieldTitle } = req.body;

    let field;
    try {
        field = await Field.findOne({title: fieldTitle});
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a field.',
            500
        );
        return next(error);
    }

    if (!field) {
        const error = new HttpError(
            'Could not find field for the provided id.',
            404
        );
        return next(error);
    }


    const certificateId = req.params.cid;
   
    let certificate;
    try {
        certificate = await Certificate.findById(certificateId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update certificate.',
            500
        );
        return next(error);
    }
    if (!certificate) {
        const error = new HttpError(
            'Could not find certificate for the provided id.',
            404
        );
        return next(error);
    }

  

    if (certificate.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this certificate.', 401);
        return next(error);
    }

    certificate.title = title;
    certificate.description = description;
    certificate.institute = institute;
    certificate.field = field.id;
    certificate.isApproved = false;

    try {
        await certificate.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update certificate.',
            500
        );
        return next(error);
    }

    res.status(200).json({ certificate: certificate.toObject({ getters: true }) });
};
const acceptCertificate = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const certificateId = req.params.cid;

    let certificate;
    try {
        certificate = await Certificate.findById(certificateId).populate({path:'creator',model:User});
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update certificate.',
            500
        );
        return next(error);
    }

    if (!certificate) {
        const error = new HttpError(
            'Could not find certificate for the provided id.',
            404
        );
        return next(error);
    }
    let setting;
    try {
        setting = await Setting.findById(certificate.creator.setting);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update setting.',
            500
        );
        return next(error);
    }

    if (!setting) {
        const error = new HttpError(
            'Could not find setting for the provided id.',
            404
        );
        return next(error);
    }
    certificate.isApproved = true;
    const newNotification = new Notification({
        message: `Congratulations! your certificate "${certificate.title}" is just approve by the administrator. Now, people are able to view it in your profile.`,
        to: certificate.creator.id,
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        certificate.creator.notifications=[newNotification,...certificate.creator.notifications];
        setting.unreadNotis = setting.unreadNotis+1;
        await certificate.save({session:sess});
        await newNotification.save({session:sess});
        await certificate.creator.save({session:sess});
        await setting.save({session:sess});
        await sess.commitTransaction();

    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not approve certificate.',
            500
        );
        return next(error);
    }
    socket.emit('notification',{userId:certificate.creator.id,notification:newNotification});
    res.status(200).json({ certificate: certificate.toObject({ getters: true }), responseMsg: "approved" });
};
const rejectCertificate = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const certificateId = req.params.cid;

    let certificate;
    try {
        certificate = await Certificate.findById(certificateId).populate({path:'creator',model:User});
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update certificate.',
            500
        );
        return next(error);
    }

    if (!certificate) {
        const error = new HttpError(
            'Could not find certificate for the provided id.',
            404
        );
        return next(error);
    }
    let setting;
    try {
        setting = await Setting.findById(certificate.creator.setting);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update setting.',
            500
        );
        return next(error);
    }

    if (!setting) {
        const error = new HttpError(
            'Could not find setting for the provided id.',
            404
        );
        return next(error);
    }
    const newNotification = new Notification({
        message: `Sorry! your certificate "${certificate.title}" is just rejected by the administrator. Please create a new certificate and provide all information.`,
        to: certificate.creator.id,
    });


    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        certificate.creator.notifications=[newNotification,...certificate.creator.notifications];
        setting.unreadNotis = setting.unreadNotis+1;
        certificate.creator.certificates.pull(certificate.id);
        await newNotification.save({session:sess});
        await setting.save({session:sess});
        await certificate.remove({ session: sess });
        await certificate.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not reject certificate.',
            500
        );
        return next(error);
    }
    socket.emit('notification',{userId:certificate.creator.id,notification:newNotification});
    res.status(200).json({ certificate: certificate.toObject({ getters: true }), responseMsg: "rejected" });
};
const deleteCertificate = async (req, res, next) => {
    const certificateId = req.params.cid;

    let certificate;
    try {
        certificate = await Certificate.findById(certificateId).populate('creator');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete certificate.',
            500
        );
        return next(error);
    }

    if (!certificate) {
        const error = new HttpError('Could not find certificate for this id.', 404);
        return next(error);
    }

    if (certificate.creator.id !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to delete this certificate.',
            401
        );
        return next(error);
    }

    const imagePath = certificate.file;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        certificate.creator.certificates.pull(certificate);
        await certificate.remove({ session: sess });
        await certificate.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete certificate.',
            500
        );
        return next(error);
    }

    fs.unlink(imagePath, err => {
        console.log(err);
    });

    res.status(200).json({ message: 'Deleted certificate.' });
};



exports.getCertificateById = getCertificateById;
exports.getCertificatesByUserId = getCertificatesByUserId;
exports.getAllCertificates = getAllCertificates;
exports.createCertificate = createCertificate;
exports.updateCertificate = updateCertificate;
exports.deleteCertificate = deleteCertificate;
exports.acceptCertificate = acceptCertificate;
exports.rejectCertificate = rejectCertificate;

