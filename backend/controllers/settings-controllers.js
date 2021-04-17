const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Setting = require("../models/setting")
const Field = require("../models/field");
const User = require("../models/user");

const getSettingById = async (req, res, next) => {
  const settingId = req.params.sid;

  let setting;
  try {
    setting = await Setting.findById(settingId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find setting.",
      500
    );
    return next(error);
  }

  if (!setting) {
    const error = new HttpError(
      "Could not find setting for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ setting: setting.toObject({ getters: true }) });
};

const getSettingByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithSetting;
  try {
    userWithSetting = await User.findById(userId).populate("setting");
  } catch (err) {
    const error = new HttpError(
      "Fetching setting failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!userWithSetting || !userWithSetting.setting) {
    return next(
      new HttpError("Could not find setting for the provided user id.", 404)
    );
  }

  res.json({
    setting: userWithSetting.setting.toObject({ getters: true }),
  });
};


const createSettings = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { notiStatus, status, role } = req.body;

    const createdSetting = new Resume({
        notiStatus,
        status, 
        role,
        blockedUsers: [],
        user: req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError(
            'Creating Setting failed, please try again.',
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
        await createdSetting.save({ session: sess });
        user.setting.id = createdSetting.id;
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Creating setting failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ setting: createdSetting });
};
 
const SwitchRole = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const settingId = req.params.sid;

    let setting;
    try {
        setting = await Setting.findById(settingId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update role.',
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
    const { role } = req.body;
   
    if (setting.user.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit current users role', 401);
        return next(error);
    }

    setting.role = role;
    try {
        await setting.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update role of user.',
            500
        );
        return next(error);
    }

    res.status(200).json({ setting: setting.toObject({ getters: true }) });
};

const deleteSettings = async (req, res, next) => {
    const settingId = req.params.sid;

    let setting;
    try {
        setting = await Setting.findById(settingId).populate('user');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete setting.',
            500
        );
        return next(error);
    }

    if (!setting) {
        const error = new HttpError('Could not find setting for this id.', 404);
        return next(error);
    }

    if (setting.user.toString() !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to delete this setting.',
            401
        );
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await setting.remove({ session: sess });
        // resume.creator.certificate='';
        // await resume.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete setting.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted setting.' });
};

exports.getSettingById = getSettingById;
exports.getSettingByUserId = getSettingByUserId;
exports.createSettings = createSettings;
exports.SwitchRole = SwitchRole;
exports.deleteSettings = deleteSettings;
