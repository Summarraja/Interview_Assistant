const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const ReportProblem= require('../models/ReportProblem');
const User = require('../models/user');

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

const getProblemByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithProblem;
  try {
    userWithProblem = await User.findById(userId).populate("problem");
  } catch (err) {
      console.log(err)
    const error = new HttpError(
      "Fetching problem failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!userWithProblem || !userWithProblem.problem) {
    return next(
      new HttpError("Could not find problem for the provided user id.", 404)
    );
  }

  res.json({
    problems: userWithProblem.problem.toObject({ getters: true }),
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

    } catch (err) {
  
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

    console.log("useris:  "+req.userData.userId)
    const createdProblem = new ReportProblem({
        title,
        answer,
        description, 
        user: req.userData.userId
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
        await createdProblem.save({ session: sess });
        user.problem.push(createdProblem);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
       console.log("error is"+ err)
        const error = new HttpError(
            'Reporting problem failed, please try again.',
            500
        );
        return next(error);
    }

    // try {
    //     await createdProblem.save();
    // } catch (err) {
    //     const error = new HttpError(
    //         'Creating Problem failed, please try again.',
    //         500
    //     );
    //     return next(error);
    // }

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

    if (problem.user.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this certificate.', 401);
        return next(error);
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



const updateProblemAdmin = async (req, res, next) => {

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
        console.log("error is ::" + err)
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
exports.getProblemByUserId = getProblemByUserId;
exports.getAllProblems = getAllProblems;
exports.getunansweredProblems = getunansweredProblems;
exports.createProblem = createProblem;
exports.updateProblem = updateProblem;
exports.updateProblemAdmin = updateProblemAdmin;
exports.deleteProblem = deleteProblem;

