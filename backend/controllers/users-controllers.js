const { validationResult } = require("express-validator");
const fs = require('fs');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const HttpError = require("../models/http-error");

const User = require("../models/user");
const Resume = require("../models/resume");
const Setting = require("../models/setting");
const EmotionStats = require("../models/emotionstats");
const Chat = require("../models/chat");
const Certificate = require("../models/certificate");
const ReportedProblem = require("../models/ReportProblem");
const Call = require("../models/call");
const Notification = require("../models/notification");
const Interview = require("../models/interview");
const Message = require("../models/message");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getUserData = async (req, res, next) => {
  let userid = req.params.uid;

  let userRequests;
  try {
    userRequests = await User.findById(userid).populate('sentRequests').populate('receivedRequests').populate('addedInterviews')

  } catch (err) {
    const error = new HttpError(
      "Fetching user sent and received requests failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!userRequests) {
    const error = new HttpError(
      "Could not find user with provided id.",
      401
    );
    return next(error);
  }

  res.json({
    sentRequests: userRequests.sentRequests.map(inter => inter.toObject({ getters: true })),
    receivedRequests: userRequests.receivedRequests.map(inter => inter.toObject({ getters: true })),
    addedInterviews: userRequests.addedInterviews.map(inter => inter.toObject({ getters: true }))
  });

};
const getUserProfile = async (req, res, next) => {
  let userid = req.params.uid;

  let user;
  try {
    user = await User.findById(userid).populate({ path: 'resume', model: Resume });

  } catch (err) {
    const error = new HttpError(
      "Fetching user failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "Could not find user with provided id.",
      401
    );
    return next(error);
  }

  res.json({
    fullname: user.resume.fullname,
    image: user.resume.image
  });

};

const sendCode = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { email } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Fetching user failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "This email does not belong to any account, Signup first..",
      500
    );
    return next(error);
  }
  const code = random4Digit();
  user.email_verify_token = code;
  user.reset_token_expired_at = Date.now() + 3600000;
  try {
    await user.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      "Something went wrong, could not send code.",
      500
    );
    return next(error);
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "lawara41@gmail.com",
      pass: "fypproject",
    },
  });

  const mailOptions = {
    from: "lawara41@gmail.com",
    to: user.email,
    subject: "SmartHire Password Reset Code",
    text:
      "You are receiving this because you (or someone else) have requested the reset of the password for your account. \n\n" +
      `The code is ${code}\n\n`,
  };
  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.log(err);
      console.log(response);
      const error = new HttpError("Something went wrong, code not sent", 500);
      return next(error);
    }
  });

  res.status(200).json({ status: true });
};

const verifyCode = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { email, code } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email }).populate("resume").populate('setting');
  } catch (err) {
    const error = new HttpError(
      "Fetching user failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "This email does not belong to any account, Signup first..",
      500
    );
    return next(error);
  }

  if (user.email_verify_token != code) {
    const error = new HttpError("Invalid Code", 500);
    return next(error);
  }
  user.email_verify_token = null;
  user.reset_token_expired_at = null;
  user.email_verified = true;
  try {
    await user.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      "Something went wrong, could not verify email",
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: user.id, email: user.email },
      "supersecret_dont_share",
      { expiresIn: "12h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(200).json({ isVerified: true, userId: user.id, token: token, resume: user.resume, setting: user.setting });
};

const uploadImage = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { userId } = req.body;
  let existingUser;
  try {
    existingUser = await User.findById(userId)
      .populate({ path: 'resume', model: Resume })
      .populate({ path: 'chats', model: Chat });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Could not find a user for provided id.",
      404
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    if (existingUser.resume.image)
      fs.unlink(existingUser.resume.image, err => {
        console.log(err);
      });
    existingUser.chats.map(async (chat) => {
      if (chat.with == existingUser.id) {
        chat.withImage = req.file.path;
      }
      if (chat.from == existingUser.id) {
        chat.fromImage = req.file.path;
      }
      await chat.save();
    })
    existingUser.resume.image = req.file.path;
    await existingUser.resume.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Image Upload failed, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json({ image: req.file.path });
};


const signup = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const {
    firstname,
    lastname,
    country,
    dob,
    email,
    phone,
    password,
    address,
    gender,
  } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }


  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }


  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }
  const createdResume = new Resume({
    firstname,
    lastname,
    fullname: firstname + " " + lastname,
    dob,
    phone,
    email,
    country,
    address,
    gender,
    professional: { desc1: ["", "", ""], desc2: ["", "", ""] },
    education: {},
    additional: [],
  });

  const createdSetting = new Setting({
    status: "available",
    role: "Candidate",
    blockedUsers: [],
    OthersBlockedMe: []
  });

  const code = random4Digit();

  const createdUser = new User({
    email,
    password: hashedPassword,
    email_verify_token: code,
    reset_token_expired_at: Date.now() + 3600000,
    createdInterviews: [],
    addedInterviews: [],
    sentRRequests: [],
    receivedRequests: [],
    problems: [],
    certificates: [],
    stats: [],
    chats: [],
    calls: [],
    notifications: [],
    resume: createdResume,
    setting: createdSetting
  });
  createdResume.user = createdUser.id;
  createdSetting.user = createdUser.id;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdUser.save({ session: sess });
    await createdResume.save({ session: sess });
    await createdSetting.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "lawara41@gmail.com",
      pass: "fypproject",
    },
  });

  const mailOptions = {
    from: "lawara41@gmail.com",
    to: createdUser.email,
    subject: "SmartHire Email Verification Code",
    text:
      "You are receiving this because you (or someone else) have created new account. \n\n" +
      `Your Email Verification Code is ${code}\n\n`,

  };

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      const error = new HttpError(
        "Account is created but code not sent",
        200 //not handled
      );
      return next(error);
    }
  });

  res.status(201).json({ userId: createdUser.id, email: createdUser.email });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email }).populate('resume')
      .populate('setting');
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      401
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }
  if (!existingUser.email_verified) {
    const error = new HttpError("Email_not_verified", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "supersecret_dont_share",
      { expiresIn: "12h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    resume: existingUser.resume,
    setting: existingUser.setting,
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

const deleteuser = async (req, res, next) => {
  const userid = req.params.uid;

  let user;
  try {
    user = await User.findById({_id : userid}, null)
      .populate({ path: 'resume', model: Resume })
      .populate({ path: 'setting', model: Setting })
      .populate({ path: 'createdInterviews', model: Interview })
      .populate({ path: 'problems', model: ReportedProblem })
      .populate({ path: 'certificates', model: Certificate })
      .populate({ path: 'stats', model: EmotionStats })
      .populate({ path: 'chats', model: Chat })
      .populate({ path: 'calls', model: Call })
      .populate({ path: 'notifications', model: Notification });
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not delete a user.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for this id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await user.remove({ session: sess });
    await user.resume.remove({ session: sess });
    await user.setting.remove({ session: sess });
    user.createdInterviews.map(async (interview) => {
      await interview.remove({ session: sess });
    })
    user.problems.map(async (problem) => {
      await problem.remove({ session: sess });
    })
    user.certificates.map(async (certificate) => {
      await certificate.remove({ session: sess });
    })
    user.stats.map(async (stat) => {
      await stat.remove({ session: sess });
    })
    user.chats.map(async (chat) => {
      await chat.remove({ session: sess });
    })
    user.calls.map(async (call) => {
      await call.remove({ session: sess });
    })
    user.notifications.map(async (notification) => {
      await notification.remove({ session: sess });
    })
    await Message.remove({ sender: user.id} , {session: sess })
    await Message.remove({ receiver: user.id} , {session: sess })
    await sess.commitTransaction();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not delete user.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "User Account Deleted" });
};

function random4Digit() {
  return shuffle("0123456789".split("")).join("").substring(0, 4);
}

function shuffle(o) {
  for (
    var j, x, i = o.length;
    i;
    j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
  );
  return o;
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.deleteuser = deleteuser;
exports.sendCode = sendCode;
exports.verifyCode = verifyCode;
exports.getUserData = getUserData;
exports.getUserProfile = getUserProfile;
exports.uploadImage = uploadImage;


