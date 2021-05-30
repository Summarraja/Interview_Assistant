const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Resume = require("../models/resume");
const Chat = require("../models/chat");
const Field = require("../models/field");
const User = require("../models/user");
const Setting = require("../models/setting");

const getResumeById = async (req, res, next) => {
  const resumeId = req.params.rid;

  let resume;
  try {
    resume = await Resume.findById(resumeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a resume.",
      500
    );
    return next(error);
  }

  if (!resume) {
    const error = new HttpError(
      "Could not find resume for the provided id.",
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
    userWithResume = await User.findById(userId).populate("resume");
  } catch (err) {
    const error = new HttpError(
      "Fetching resume failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!userWithResume || !userWithResume.resume) {
    return next(
      new HttpError("Could not find resume for the provided user id.", 404)
    );
  }

  res.json({
    resume: userWithResume.resume.toObject({ getters: true }),
  });
};

const getResumeByUserName = async (req, res, next) => {
  const userName = req.params.name;
  let blockIDs = [];
  let blockMeIDs = [];

  let userWithResume;
  try {
    userWithResume = await Resume.find({ fullname: new RegExp(userName, "i") }).populate('user')
  } catch (err) {
    const error = new HttpError(
      "Fetching resume failed, please try again later.",
      500
    );
    return next(error);
  }

   userWithResume = userWithResume.filter( (ResUsr) =>ResUsr.user.email_verified !== false );

  let userWithSetting;
  try {
    userWithSetting = await User.findById(req.userData.userId).populate(
      "setting"
    );
  } catch (err) {
    const error = new HttpError(
      "Fetching user setting failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!userWithSetting || !userWithSetting.setting) {
    return next(
      new HttpError("Could not find setting for the provided user id.", 404)
    );
  }
  try {
    SettingWithBlockedUsers = await Setting.findById(
      userWithSetting.setting._id
    )
      .populate("blockedUsers")
      .populate("OthersBlockedMe");
  } catch (err) {
    const error = new HttpError(
      "Fetching blocked Users failed, please try again later.",
      500
    );
    return next(error);
  }

  SettingWithBlockedUsers.blockedUsers.map((block) => blockIDs.push(block._id));

  SettingWithBlockedUsers.OthersBlockedMe.map((otherBlockMe) =>
    blockMeIDs.push(otherBlockMe._id)
  );

  let Blocked = SettingWithBlockedUsers.blockedUsers.map((blkUsr) => {
    return blkUsr._id;
  });
  let userBlockedMe = SettingWithBlockedUsers.OthersBlockedMe.map(
    (OtherblkMe) => {
      return OtherblkMe._id;
    }
  );

  let filteredResumes = userWithResume.filter(
    (ResUsr) =>
      !Blocked.includes(ResUsr.user) && !userBlockedMe.includes(ResUsr.user)
  );

  res.json({
    resumes: filteredResumes.map((resume) =>
      resume.toObject({ getters: true })
    ),
  });
};


const getAllResumesByUsername = async (req, res, next) => {
  const userName = req.params.name;

  let userWithResume;
  try {
    userWithResume = await Resume.find({ fullname: new RegExp(userName, "i") }).populate('user')
  } catch (err) {
    const error = new HttpError(
      "Fetching resume failed, please try again later.",
      500
    );
    return next(error);
  }

  let verifiedResumes = userWithResume.filter( (ResUsr) =>ResUsr.user.email_verified !== false );
  
  res.json({
    resumes: verifiedResumes.map((resume) =>
      resume.toObject({ getters: true })
    ),
  });
};

const createResume = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const {
    firstName,
    lastName,
    dob,
    phone,
    email,
    city,
    maxEducation,
    experience,
    fieldId,
  } = req.body;

  let field;
  try {
    field = await Field.findById(fieldId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a field.",
      500
    );
    return next(error);
  }

  if (!field) {
    const error = new HttpError(
      "Could not find field for the provided id.",
      404
    );
    return next(error);
  }

  const createdResume = new Resume({
    firstName,
    lastName,
    fullName: firstName + " " + lastName,
    dob,
    phone,
    email,
    city,
    maxEducation,
    experience,
    field: field.id,
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      "Creating Resume failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    user.resume = createResume;
    await createdResume.save({ session: sess });
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating resume failed, please try again.",
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
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const resumeId = req.params.rid;

  let user;
  try {
    user = await User.findOne({resume:resumeId})
    .populate({path:'resume',model:Resume})
    .populate({path:'chats',model:Chat});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find user.",
      500
    );
    return next(error);
  }
  if (!user) {
    const error = new HttpError(
      "Could not find user for the provided resume id.",
      404
    );
    return next(error);
  }
  const {
    firstname,
    lastname,
    dob,
    phone,
    email,
    city,
    country,
    address,
    maxEducation,
    experience,
    fieldId,
    professional,
    education,
    additional,
  } = req.body;

  if (fieldId) {
    let field;
    try {
      field = await Field.findById(fieldId);
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find a field.",
        500
      );
      return next(error);
    }

    if (!field) {
      const error = new HttpError(
        "Could not find field for the provided id.",
        404
      );
      return next(error);
    }
  }

  if (user.id.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit this resume.",
      401
    );
    return next(error);
  }

  user.resume.firstname = firstname;
  user.resume.lastname = lastname;
  user.resume.fullname = firstname + " " + lastname;
  user.resume.dob = dob;
  user.resume.phone = phone;
  user.resume.email = email;
  user.resume.city = city;
  user.resume.country = country;
  user.resume.address = address;
  user.resume.maxEducation = maxEducation;
  user.resume.experience = experience;
  user.resume.field = fieldId && field.id;
  user.resume.professional=professional;
  user.resume.education=education;
  user.resume.additional=additional;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    user.chats.map(async (chat)=>{
      if(chat.with==user.id){
        chat.withName=user.resume.fullname;
      }
      if(chat.from==user.id){
        chat.fromName=user.resume.fullname;
      }
      await chat.save();
    })
    await user.resume.save();
    sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update resume.",
      500
    );
    return next(error);
  }

  res.status(200).json({ resume: user.resume.toObject({ getters: true }), message: "Updated resume."});
};

const deleteResume = async (req, res, next) => {
  const resumeId = req.params.rid;

  let resume;
  try {
    resume = await Resume.findById(resumeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete resume.",
      500
    );
    return next(error);
  }

  if (!resume) {
    const error = new HttpError("Could not find resume for this id.", 404);
    return next(error);
  }

  if (resume.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this resume.",
      401
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await resume.remove({ session: sess });
    resume.creator.certificate = "";
    await resume.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete resume.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted resume." });
};

exports.getResumeById = getResumeById;
exports.getResumeByUserId = getResumeByUserId;
exports.getAllResumesByUsername = getAllResumesByUsername;
exports.getResumeByUserName = getResumeByUserName;
exports.createResume = createResume;
exports.updateResume = updateResume;
exports.deleteResume = deleteResume;
