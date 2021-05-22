const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Faq = require('../models/faq');

const getFaqById = async (req, res, next) => {
    const faqId = req.params.fid;

    let faq;
    try {
        faq = await Faq.findById(faqId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find a faq.',
            500
        );
        return next(error);
    }

    if (!faq) {
        const error = new HttpError(
            'Could not find faq for the provided id.',
            404
        );
        return next(error);
    }

    res.json({ faq: faq.toObject({ getters: true }) });
};

const getAllFaqs = async (req, res, next) => {

    let faqs;
    try {
        faqs = await Faq.find();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find all faqs.',
            500
        );
        return next(error);
    }

    if (!faqs) {
        const error = new HttpError(
            'Could not find all faqs.',
            404
        );
        return next(error);
    }

    res.json({
        faqs: faqs.map(faq =>
            faq.toObject({ getters: true })
        )
    });
};

const getSearchedFaqs = async (req, res, next) => {

    const searchItem = req.params.word;

  let searchedFaq;
  try {
    searchedFaq = await Faq.find({
      $or: [{ question: new RegExp(searchItem, "i")  }],
    }).exec();
  } catch (err) {
    const error = new HttpError(
      "Fetching searched Faqs failed, please try again later.",
      500
    );
    return next(error);
  }

    if (!searchedFaq) {
        const error = new HttpError(
            'Could not find searched faqs.',
            404
        );
        return next(error);
    }

    res.json({
        searchedFaq: searchedFaq.map(faq =>
            faq.toObject({ getters: true })
        )
    });
};

const createFaq = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const { question, answer } = req.body;

    const createdFaq = new Faq({
        question,
        answer
    });

    try {
        await createdFaq.save();
    } catch (err) {
        const error = new HttpError(
            'Creating Faq failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ faq: createdFaq });
};

const updateFaq = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { question, answer } = req.body;

    const faqId = req.params.fid;
    let faq;
    try {
        faq = await Faq.findById(faqId);
    } catch (error) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    if (!faq) {
        return next(
            new HttpError('Could not find Faq for specified id.', 422)
        );
    }
    faq.question = question;
    faq.answer = answer;
    try {
        await faq.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update Faq.',
            500
        );
        return next(error);
    }

    res.status(200).json({ faq: faq.toObject({ getters: true }) });
};

const deleteFaq = async (req, res, next) => {
    const faqId = req.params.fid;

    let faq;
    try {
        faq = await Faq.findById(faqId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete faq.',
            500
        );
        return next(error);
    }

    if (!faq) {
        const error = new HttpError('Could not find faq for this id.', 404);
        return next(error);
    }

    try {
        await faq.remove();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete faq.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted faq.' });
};

exports.getFaqById = getFaqById;
exports.getAllFaqs = getAllFaqs;
exports.getSearchedFaqs = getSearchedFaqs;
exports.createFaq = createFaq;
exports.updateFaq = updateFaq;
exports.deleteFaq = deleteFaq;

