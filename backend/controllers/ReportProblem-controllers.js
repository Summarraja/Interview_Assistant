const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const ReportProblem= require('../models/ReportProblem');

const getProblemById = async (req, res, next) => {
    const ProblemId = req.params.pid;

    let problem;
    try {
        problem = await ReportProblem.findById(ProblemId);
    } catch (err) {
        console.log(err)
        const error = new HttpError(
            'Something went wrong, could not find a problem.',
            500
        );
        return next(error);
    }

    if (!problem) {
        const error = new HttpError(
            'Could not find problem for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ problem: problem.toObject({ getters: true }) });
};

const getAllProblems = async (req, res, next) => {

    let problems;
    try {
        problems = await ReportProblem.find();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find all Reported Problems.',
            500
        );
        return next(error);
    }

    if (!problems) {
        const error = new HttpError(
            'Could not find all problems.',
            404
        );
        return next(error);
    }

    res.json({
        problems: problems.map(problem =>
            problem.toObject({ getters: true })
        )
    });
};

const getunansweredProblems = async (req, res, next) => {
console.log("UNANSWER: ")
    let unanswerdproblems;
    try {
        unanswerdproblems = await ReportProblem.find({ 
            "answer": { "$exists": true },
            "$expr": { "$lt": [ { "$strLenCP": "$answer" }, 1 ] } 
        });
console.log("PROBLEMSL: "+unanswerdproblems)
    } catch (err) {
        console.log("error is"+ err)
        const error = new HttpError(
            'Something went wrong, could not find all Reported Problems.',
            500
        );
        return next(error);
    }

    if (!unanswerdproblems) {
        const error = new HttpError(
            'Could not find all problems.',
            404
        );
        return next(error);
    }

    res.json({
        unanswerdproblems: unanswerdproblems.map(problem =>
            problem.toObject({ getters: true })
        )
    });
};


const createProblem = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const { title, answer, description } = req.body;

    const createdProblem = new ReportProblem({
        title,
        answer,
        description
    });

    try {
        await createdProblem.save();
    } catch (err) {
        const error = new HttpError(
            'Creating Problem failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ problem : createdProblem });
};

const updateProblem = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const {title, answer, description } = req.body;

    const problemId = req.params.pid;
    let problem;
    try {
        problem = await ReportProblem.findById(problemId);
    } catch (error) {
        {console.log("error manhoos"+ error)}
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    if (!problem) {
        return next(
            new HttpError('Could not find problem for specified id.', 422)
        );
    }
    problem.title = title;
    problem.answer = answer;
    problem.description=description;
    try {
        await problem.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update problem.',
            500
        );
        return next(error);
    }

    res.status(200).json({ problem: problem.toObject({ getters: true }) });
};


const deleteProblem = async (req, res, next) => {
    const problemId = req.params.pid;

    let problem;
    try {
        problem = await ReportProblem.findById(problemId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete a problem.',
            500
        );
        return next(error);
    }

    if (!problem) {
        const error = new HttpError('Could not find problem for this id.', 404);
        return next(error);
    }

    try {
        await problem.remove();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete problem.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted problem.' });
};

exports.getProblemById = getProblemById;
exports.getAllProblems = getAllProblems;
exports.getunansweredProblems = getunansweredProblems;
exports.createProblem = createProblem;
exports.updateProblem = updateProblem;
exports.deleteProblem = deleteProblem;

