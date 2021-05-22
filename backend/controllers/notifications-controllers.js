const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Notification = require('../models/notification');
const User = require('../models/user');

const getNotificationsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithNotification;
  try {
    userWithNotification = await User.findById(userId).populate({ path: "notifications", model: Notification });
  } catch (err) {
    const error = new HttpError(
      "Fetching notifications failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!userWithNotification || userWithNotification.notifications.length == 0) {
    return next(
      new HttpError("Could not find notifications for the provided user id.", 404)
    );
  }

  res.json({
    notifications: userWithNotification.notifications.toObject({ getters: true }),
  });
};
const clearNotificationsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithNotification;
  try {
    userWithNotification = await User.findById(userId).populate({ path: "notifications", model: Notification });
  } catch (err) {
    const error = new HttpError(
      "Fetching notifications failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!userWithNotification || userWithNotification.notifications.length == 0) {
    return next(
      new HttpError("Could not find notifications for the provided user id.", 404)
    );
  }
  try{
    const sess = await mongoose.startSession();
    sess.startTransaction();
    userWithNotification.notifications.map(async (notification)=>{
      await notification.remove();
    });
    userWithNotification.notifications=[];
    await userWithNotification.save();
    await sess.commitTransaction();

  }catch(err){
    return next(
      new HttpError("Could not clear notifications for the provided user id.", 404)
    );
  }

  res.json({
    message: "Notifications Cleared Successfully",
  });
};

exports.getNotificationsByUserId = getNotificationsByUserId;
exports.clearNotificationsByUserId = clearNotificationsByUserId;
