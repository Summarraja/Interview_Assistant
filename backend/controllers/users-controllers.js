const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Resume = require("../models/resume");
const Setting = require("../models/setting");

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
  let user;
  try {
    user = await User.findById(userid).populate("resume");
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
  res.json({ name: user.resume.firstname + " " + user.resume.lastname });
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
    user = await (await User.findOne({ email: email }).populate("resume")).populated('setting');
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

  res.status(200).json({ isVerified: true, userId: user.id, token: token, resume: user.resume });
};

const uploadImage = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { userId } = req.body;
  console.log("yes")
  let existingUser;
  try {
    existingUser = await User.findById(userId).populate('resume');
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
    existingUser.resume.image=req.file.path;
    await existingUser.resume.save();
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
  });

  const createdSetting = new Setting({
    notiStatus: false,
    status: "available",
    role: "Candidate",
    blockedUsers: [],
  });

  const code = random4Digit();

  const createdUser = new User({
    email,
    password: hashedPassword,
    email_verify_token: code,
    reset_token_expired_at: Date.now() + 3600000,
    createdInterviews: [],
    sentRRequests: [],
    receivedRequests: [],
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
    await createdUser.save();
    await createdResume.save();
    await createdSetting.save();
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
exports.sendCode = sendCode;
exports.verifyCode = verifyCode;
exports.getUserData = getUserData;
exports.uploadImage = uploadImage;
