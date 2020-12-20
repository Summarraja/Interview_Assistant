const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Resume = require('../models/resume');
const Field = require('../models/field');
const User = require('../models/user');

const getResumeById = async (req, res, next) => {
    const resumeId = req.params.rid;

    let resume;
    try {
        resume = await Resume.findById(resumeId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a resume.',
            500
        );
        return next(error);
    }

    if (!resume) {
        const error = new HttpError(
            'Could not find resume for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ resume: resume.toObject({ getters: true }) });
};

const getResumeByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userWithResume;
    try {
        userWithResume = await User.findById(userId).populate('resume');
    } catch (err) {
        const error = new HttpError(
            'Fetching resume failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!userWithResume || !userWithResume.resume) {
        return next(
            new HttpError('Could not find resume for the provided user id.', 404)
        );
    }

    res.json({
        resume: userWithResume.resume.toObject({ getters: true })
    });
};

const createResume = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { firstName, lastName, dob, phone, email, city, maxEducation, experience, fieldId } = req.body;

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

    const createdResume = new Resume({
        firstName,
        lastName,
        dob,
        phone,
        email,
        city,
        maxEducation,
        experience,
        field: field.id,
        creator: req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError(
            'Creating Resume failed, please try again.',
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
        await createResume.save({ session: sess });
        user.resume.id = createResume.id;
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Creating resume failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ resume: createResume });
};

const updateResume = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const resumeId = req.params.rid;

    let resume;
    try {
        resume = await Resume.findById(resumeId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update resume.',
            500
        );
        return next(error);
    }
    if (!resume) {
        const error = new HttpError(
            'Could not find resume for the provided id.',
            404
        );
        return next(error);
    }
    const { firstName, lastName, dob, phone, email, city, maxEducation, experience, fieldId } = req.body;
    
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

    if (resume.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this resume.', 401);
        return next(error);
    }

    resume.firstName = firstName;
    resume.lastName = lastName;
    resume.dob = dob;
    resume.phone = phone;
    resume.email = email;
    resume.city = city;
    resume.maxEducation = maxEducation;
    resume.experience = experience;
    resume.field = field.id;

    try {
        await resume.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update resume.',
            500
        );
        return next(error);
    }

    res.status(200).json({ resume: resume.toObject({ getters: true }) });
};

const deleteResume = async (req, res, next) => {
    const resumeId = req.params.rid;

    let resume;
    try {
        resume = await Resume.findById(resumeId).populate('creator');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete resume.',
            500
        );
        return next(error);
    }

    if (!resume) {
        const error = new HttpError('Could not find resume for this id.', 404);
        return next(error);
    }

    if (resume.creator.id !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to delete this resume.',
            401
        );
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await resume.remove({ session: sess });
        resume.creator.certificate='';
        await resume.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete resume.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted resume.' });
};

exports.getResumeById = getResumeById;
exports.getResumeByUserId = getResumeByUserId;
exports.createResume = createResume;
exports.updateResume = updateResume;
exports.deleteResume = deleteResume;
