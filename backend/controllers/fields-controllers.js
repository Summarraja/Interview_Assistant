const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Field = require('../models/field');
const Skill = require('../models/skill');

const getFieldById = async (req, res, next) => {
    const fieldId = req.params.fid;

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

    res.json({ field: field.toObject({ getters: true }) });
};

const getFieldByTitle = async (req, res, next) => {
   const fieldTitle = req.params.ft;

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

    res.json({ field: field.toObject({ getters: true }) });
};

const createField = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
            );
        }
    const { title, description  } = req.body;

    let field;
    try {
        field = await Field.findOne({title:title});
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a field.',
            500
        );
        return next(error);
    }

    if (field) {
        const error = new HttpError(
            'Field already exists for the provided title.',
            404
        );
        return next(error);
    }

    const createdField = new Field({
        title,
        description,
        skills:[]
    });

    try {
        await createdField.save();
    } catch (err) {
        const error = new HttpError(
            'Creating field failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ field: createdField });
};

const updateField= async (req, res, next) => {
    const fieldTitle = req.params.ft;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { title, description} = req.body;

    let field;
    try {
        field = await Field.findOne({title:fieldTitle});
    } catch (error) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    if(!field){
        return next(
            new HttpError('Could not find field for specified title.', 422)
        );
    }
    field.title=title;
    field.description=description;
    try {
         await field.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update field.',
            500
        );
        return next(error);
    }

    res.status(200).json({ field: field.toObject({ getters: true }) });
};

const deleteField = async (req, res, next) => {
    const fieldTitle = req.params.ft;

    let field;
    try {
        field = await Field.findOne({title:fieldTitle});
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete field.',
            500
        );
        return next(error);
    }

    if (!field) {
        const error = new HttpError('Could not find field for this title.', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await field.remove({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete field.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted field.' });
};

const addSkill= async (req, res, next) => {
    const fieldTitle = req.params.ft;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    let field;
    try {
        field = await Field.findOne({title:fieldTitle});
    } catch (error) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    let {skillId} = req.body;

    let skill;
    try {
        skill = await Field.findById(skillId);
    } catch (error) {
        return next(
            new HttpError('Could not find skill for specified id.', 422)
        );
    }
    const added = field.skills.addToSet(Skill);
    if (added.length<1) {
        const error = new HttpError('Skill is already added to the field.', 401);
        return next(error);
    }
    try {
        await field.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not add skill.',
            500
        );
        return next(error);
    }

    res.status(200).json({ field: field.toObject({ getters: true }) });
};
const removeSkill= async (req, res, next) => {
    const fieldTitle = req.params.ft;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    let field;
    try {
        field = await Field.findOne({title:fieldTitle});
    } catch (error) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    let {skillId} = req.body;

    let skill;
    try {
        skill = await Field.findById(skillId);
    } catch (error) {
        return next(
            new HttpError('Could not find skill for specified id.', 422)
        );
    }
    if (!field.skills.includes(Skill.id)) {
        const error = new HttpError('Skill is already not added in the field.', 401);
        return next(error);
    }
    field.skills.pull(skill);

    try {
        await field.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not remove skill.',
            500
        );
        return next(error);
    }

    res.status(200).json({ field: field.toObject({ getters: true }) });
};
exports.getFieldById = getFieldById;
exports.getFieldByTitle = getFieldByTitle;
exports.createField = createField;
exports.updateField = updateField;
exports.deleteField = deleteField;
exports.addSkill = addSkill;
exports.removeSkill = removeSkill;
