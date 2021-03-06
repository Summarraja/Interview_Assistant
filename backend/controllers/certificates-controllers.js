//const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Certificate = require('../models/certificate');
const Field = require('../models/field');
const User = require('../models/user');

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
    if (!userWithCertificate || userWithCertificate.certificates.length == 0) {
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

const createCertificate = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { title, description, institute, fieldId } = req.body;

    let field;
    try {
        field = await Field.findById(fieldId);
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

    const createdCertificate = new Certificate({
        title,
        description,
        institute,
        image: req.file != undefined ? req.file.path : "/", //change
        field: field.id,
        creator: req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try again.',
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
        await createdCertificate.save({ session: sess });
        user.certificates.push(createdCertificate);
        await user.save({ session: sess });
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

    const { title, description, institute, fieldId } = req.body;
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

    let field;
    try {
        field = await Field.findById(fieldId);
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
    certificate.isApproved = true;

    try {
        await certificate.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not approve certificate.',
            500
        );
        return next(error);
    }

    res.status(200).json({ certificate: certificate.toObject({ getters: true }) });
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
    certificate.isApproved = false;

    try {
        await certificate.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not disapprove certificate.',
            500
        );
        return next(error);
    }

    res.status(200).json({ certificate: certificate.toObject({ getters: true }) });
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

    const imagePath = certificate.image;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await certificate.remove({ session: sess });
        certificate.creator.certificates.pull(certificate);
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
exports.createCertificate = createCertificate;
exports.updateCertificate = updateCertificate;
exports.deleteCertificate = deleteCertificate;
exports.acceptCertificate = acceptCertificate;
exports.rejectCertificate = rejectCertificate;
