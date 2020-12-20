const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Skill = require('../models/skill');

const getSkillById = async (req, res, next) => {
    const skillId = req.params.sid;

    let skill;
    try {
        skill = await Skill.findById(skillId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a skill.',
            500
        );
        return next(error);
    }

    if (!skill) {
        const error = new HttpError(
            'Could not find skill for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ skill: skill.toObject({ getters: true }) });
};

const getSkillByTitle = async (req, res, next) => {
    const skillTitle = req.params.st;

    let skill;
    try {
        skill = await Skill.findOne({ title: skillTitle });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a skill.',
            500
        );
        return next(error);
    }

    if (!skill) {
        const error = new HttpError(
            'Could not find skill for the provided title.',
            404
        );
        return next(error);
    }

    res.json({ skill: skill.toObject({ getters: true }) });
};

const createSkill = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const { title, description } = req.body;

    let skill;
    try {
        skill = await Skill.findOne({ title: title });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a skill.',
            500
        );
        return next(error);
    }

    if (skill) {
        const error = new HttpError(
            'Skill already exists for the provided title.',
            404
        );
        return next(error);
    }

    const createdSkill = new Skill({
        title,
        description
    });

    try {
        await createdSkill.save();
    } catch (err) {
        const error = new HttpError(
            'Creating skill failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ skill: createdSkill });
};

const updateSkill = async (req, res, next) => {
    const skillTitle = req.params.st;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { title, description } = req.body;

    let skill;
    try {
        skill = await Skill.findOne({ title: skillTitle });
    } catch (error) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    if (!skill) {
        return next(
            new HttpError('Could not find skill for specified title.', 422)
        );
    }
    skill.title = title;
    skill.description = description;
    try {
        await skill.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update skill.',
            500
        );
        return next(error);
    }

    res.status(200).json({ skill: skill.toObject({ getters: true }) });
};

const deleteSkill = async (req, res, next) => {
    const skillTitle = req.params.st;

    let skill;
    try {
        skill = await Field.findOne({ title: skillTitle });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete skill.',
            500
        );
        return next(error);
    }

    if (!skill) {
        const error = new HttpError('Could not find skill for this title.', 404);
        return next(error);
    }

    try {
        await skill.remove();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete skill.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted skill.' });
};

exports.getSkillById = getSkillById;
exports.getSkillByTitle = getSkillByTitle;
exports.createSkill = createSkill;
exports.updateSkill = updateSkill;
exports.deleteSkill = deleteSkill;

