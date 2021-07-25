const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const socket = require('../RTC/socket-context');
const HttpError = require("../models/http-error");
const Interview = require("../models/interview");
const Field = require("../models/field");
const User = require("../models/user");
const Setting = require("../models/setting");
const Notification = require('../models/notification');
const notification = require("../models/notification");

const getInterviewById = async (req, res, next) => {
  const interviewId = req.params.iid;

  let interview;
  try {
    interview = await Interview.findById(interviewId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a interview.",
      500
    );
    return next(error);
  }

  if (!interview) {
    const error = new HttpError(
      "Could not find interview for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ interview: interview.toObject({ getters: true }) });
};

const getInterviewsByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithInterviews;
  try {
    userWithInterviews = await User.findById(userId).populate(
      "createdInterviews"
    );
  } catch (err) {
    const error = new HttpError(
      "Fetching interviews failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!userWithInterviews) {
    return next(
      new HttpError("Could not find interviews for the provided user id.", 404)
    );
  }
  if (userWithInterviews.createdInterviews.length === 0) {
    res.json({
      interviews: [],
    });
  } else {
    res.json({
      interviews: userWithInterviews.createdInterviews.map((interview) =>
        interview.toObject({ getters: true })
      ),
    });
  }
};
const getInterviewerRequests = async (req, res, next) => {
  let interId = req.params.iid;

  let interviewerRequests;
  try {
    interviewerRequests = await Interview.findById(interId)
      .populate("sentRequests")
      .populate("receivedRequests")
      .populate("candidates");
  } catch (err) {
    const error = new HttpError(
      "Fetching interviewer sent and received requests failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!interviewerRequests) {
    const error = new HttpError(
      "Could not find interview with provided id.",
      401
    );
    return next(error);
  }

  res.json({
    sentRequests: interviewerRequests.sentRequests.map((candidate) =>
      candidate.toObject({ getters: true })
    ),
    receivedRequests: interviewerRequests.receivedRequests.map((candidate) =>
      candidate.toObject({ getters: true })
    ),
    candidates: interviewerRequests.candidates.map((candidate) =>
      candidate.toObject({ getters: true })
    ),
  });
};
const createInterview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, date, time, fieldTitle } = req.body;

  let field;
  try {
    field = await Field.findOne({ title: fieldTitle });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a field.",
      500
    );
    return next(error);
  }

  if (!field) {
    const error = new HttpError(
      "Could not find field for the provided title.",
      404
    );
    return next(error);
  }

  const createdInterview = new Interview({
    title,
    description,
    date,
    time,
    field: field.id,
    creator: req.userData.userId,
    candidates: [],
    sentRequests: [],
    receivedRequests: [],
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Finding user failed, please try again.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    user.createdInterviews.push(createdInterview);
    await createdInterview.save({ session: sess });
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating interview failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ Interview: createdInterview });
};

const updateInterview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, date, time, fieldTitle, isCancelled } = req.body;

  let field;
  try {
    field = await Field.findOne({ title: fieldTitle });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a field.",
      500
    );
    return next(error);
  }
  if (!field) {
    const error = new HttpError(
      "Could not find field for the provided title.",
      404
    );
    return next(error);
  }
  const interviewId = req.params.iid;

  let interview;
  try {
    interview = await Interview.findById(interviewId);
  } catch (err) {
    const error = new HttpError(
      "could not find interview of specified id.",
      500
    );
    return next(error);
  }
  if (!interview) {
    const error = new HttpError(
      "Could not find interview for the provided id.",
      404
    );
    return next(error);
  }
  if (interview.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit this interview.",
      401
    );
    return next(error);
  }

  interview.title = title;
  interview.description = description;
  interview.date = date;
  Interview.time = time;
  interview.field = field.id;
  interview.isCancelled = isCancelled;

  if (isCancelled) {
    let SentCandidatesArray = [];
    if (interview.receivedRequests.length !== 0) {
      interview.receivedRequests.map((candidate) =>
        SentCandidatesArray.push(candidate._id)
      );
    }

    let ReceiveCandidatesArray = [];
    if (interview.sentRequests.length !== 0) {
      interview.sentRequests.map((candidate) =>
        ReceiveCandidatesArray.push(candidate._id)
      );
    }

    let sentUserOut;
    if (interview.receivedRequests.length !== 0) {
      for (i = 0; i < SentCandidatesArray.length; i++) {
        sentUserOut = await User.findById(SentCandidatesArray[i]);
        sentUserOut.sentRequests.pull(interviewId);
        try {
          await sentUserOut.save();
        } catch (err) {
          const error = new HttpError(
            "Updating Cancelled Interview Users failed, please try again.",
            500
          );
          return next(error);
        }
      }
    }
    let ReceivedUserOut;
    if (interview.sentRequests.length !== 0) {
      for (i = 0; i < ReceiveCandidatesArray.length; i++) {
        ReceivedUserOut = await User.findById(ReceiveCandidatesArray[i]);
        ReceivedUserOut.receivedRequests.pull(interviewId);
        try {
          await ReceivedUserOut.save();
        } catch (err) {
          const error = new HttpError(
            "Updating Cancelled Interview Users failed, please try again.",
            500
          );
          return next(error);
        }
      }
    }
  }
  interview.sentRequests.map((candidate) =>
    interview.sentRequests.pull(candidate._id)
  );
  interview.receivedRequests.map((candidate) =>
    interview.receivedRequests.pull(candidate)
  );

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await interview.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Updating interview failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(200).json({
    interview: interview.toObject({ getters: true }),
    responseDone: "Cancelled",
  });
};

const deleteInterview = async (req, res, next) => {
  const interviewId = req.params.iid;

  let interview;
  try {
    interview = await Interview.findById(interviewId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete interview.",
      500
    );
    return next(error);
  }

  if (!interview) {
    const error = new HttpError("Could not find interview for this id.", 404);
    return next(error);
  }

  if (interview.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this interview.",
      401
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    interview.creator.createdInterviews.pull(interview.id);
    await interview.remove({ session: sess });
    await interview.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete interview.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Interview Deleted" });
};

const AcceptInviteReq = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { uid } = req.body;

  let candidate;
  try {
    candidate = await User.findById(uid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a User.",
      500
    );
    return next(error);
  }

  if (!candidate) {
    const error = new HttpError(
      "Could not find candidate for the provided id.",
      404
    );
    return next(error);
  }
  const interviewId = req.params.iid;

  let interview;
  try {
    interview = await Interview.findById(interviewId);
  } catch (err) {
    const error = new HttpError(
      "Could not find interview of specified id.",
      500
    );
    return next(error);
  }
  if (!interview) {
    const error = new HttpError(
      "Could not find interview for the provided id.",
      404
    );
    return next(error);
  }
  // if (interview.creator.toString() !== req.userData.userId) {
  //     const error = new HttpError('You are not allowed to edit this interview.', 401);
  //     return next(error);
  // }

  const added = interview.candidates.addToSet(candidate.id);
  if (added.length < 1) {
    const error = new HttpError(
      "Candidate is already added to the interview.",
      401
    );
    return next(error);
  }
  let interviewer;
  try {
    interviewer = await User.findById(interview.creator).populate({ path: 'setting', model: Setting });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong Could not find interviewer.",
      500
    );
    return next(error);
  }
  if (!interviewer) {
    const error = new HttpError(
      "Could not find interviewer for the provided id.",
      404
    );
    return next(error);
  }
  const newNotification = new Notification({
    message: `A candidate has accepted your request for the interview "${interview.title}".`,
    to: interviewer.id,
  });
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    candidate.receivedRequests.pull(interview.id);
    candidate.addedInterviews.addToSet(interview.id);
    interview.sentRequests.pull(candidate.id);
    interviewer.notifications = [newNotification, ...interviewer.notifications];
    interviewer.setting.unreadNotis = interviewer.setting.unreadNotis + 1;
    await interviewer.save({ session: sess });
    await interview.save({ session: sess });
    await candidate.save({ session: sess });
    await newNotification.save({session:sess});
    await interviewer.setting.save({session:sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not add candidate to interview.",
      500
    );
    return next(error);
  }
  socket.emit('notification', { userId: interviewer.id, notification: newNotification });

  res.status(200).json({
    interview: interview.toObject({ getters: true }),
    responseDone: "accepted",
  });
};

const rejectInviteReq = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { uid } = req.body;

  let candidate;
  try {
    candidate = await User.findById(uid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a User.",
      500
    );
    return next(error);
  }

  if (!candidate) {
    const error = new HttpError(
      "Could not find candidate for the provided id.",
      404
    );
    return next(error);
  }
  const interviewId = req.params.iid;

  let interview;
  try {
    interview = await Interview.findById(interviewId);
  } catch (err) {
    const error = new HttpError(
      "Could not find interview of specified id.",
      500
    );
    return next(error);
  }
  if (!interview) {
    const error = new HttpError(
      "Could not find interview for the provided id.",
      404
    );
    return next(error);
  }
  let interviewer;
  try {
    interviewer = await User.findById(interview.creator).populate({ path: 'setting', model: Setting });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong Could not find interviewer.",
      500
    );
    return next(error);
  }
  if (!interviewer) {
    const error = new HttpError(
      "Could not find interviewer for the provided id.",
      404
    );
    return next(error);
  }

  const newNotification = new Notification({
    message: `A candidate has rejcted your invitation to the interview "${interview.title}".`,
    to: interviewer.id,
  });
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    candidate.receivedRequests.pull(interview.id);
    interview.sentRequests.pull(candidate.id);
    interviewer.notifications = [newNotification, ...interviewer.notifications];
    interviewer.setting.unreadNotis =interviewer.setting.unreadNotis + 1;
    await interview.save({ session: sess });
    await candidate.save({ session: sess });
    await interviewer.save({ session: sess });
    await interviewer.setting.save({session:sess});
    await newNotification.save({session:sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not reject invitation request to interview.",
      500
    );
    return next(error);
  }
  socket.emit('notification', { userId: interviewer.id, notification: newNotification });

  res.status(200).json({
    interview: interview.toObject({ getters: true }),
    responseDone: "rejected",
  });
};

const AcceptCandidateReq = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { uid } = req.body;

  let candidate;
  try {
    candidate = await User.findById(uid).populate({ path: 'setting', model: Setting });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a User.",
      500
    );
    return next(error);
  }

  if (!candidate) {
    const error = new HttpError(
      "Could not find candidate for the provided id.",
      404
    );
    return next(error);
  }
  const interviewId = req.params.iid;

  let interview;
  try {
    interview = await Interview.findById(interviewId);
  } catch (err) {
    const error = new HttpError(
      "Could not find interview of specified id.",
      500
    );
    return next(error);
  }
  if (!interview) {
    const error = new HttpError(
      "Could not find interview for the provided id.",
      404
    );
    return next(error);
  }

  const added = interview.candidates.addToSet(candidate.id);
  if (added.length < 1) {
    const error = new HttpError(
      "Candidate is already added to the interview.",
      401
    );
    return next(error);
  }
  const newNotification = new Notification({
    message: `Congratulations! You are selected for the interview "${interview.title}". Remember the schedule and be on time. `,
    to: candidate.id,
  });
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    candidate.sentRequests.pull(interview.id);
    interview.receivedRequests.pull(candidate.id);
    candidate.addedInterviews.addToSet(interview.id);
    candidate.notifications = [newNotification, ...candidate.notifications];
    candidate.setting.unreadNotis = candidate.setting.unreadNotis + 1;
    await newNotification.save({session:sess});
    await interview.save({ session: sess });
    await candidate.save({ session: sess });
    await candidate.setting.save({session:sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not add candidate to interview.",
      500
    );
    return next(error);
  }
  socket.emit('notification', { userId: candidate.id, notification: newNotification });

  res.status(200).json({
    interview: interview.toObject({ getters: true }),
    responseDone: "accepted",
  });
};

const RejectCandidateReq = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { uid } = req.body;

  let candidate;
  try {
    candidate = await User.findById(uid).populate({ path: 'setting', model: Setting });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a User.",
      500
    );
    return next(error);
  }

  if (!candidate) {
    const error = new HttpError(
      "Could not find candidate for the provided id.",
      404
    );
    return next(error);
  }
  const interviewId = req.params.iid;

  let interview;
  try {
    interview = await Interview.findById(interviewId);
  } catch (err) {
    const error = new HttpError(
      "Could not find interview of specified id.",
      500
    );
    return next(error);
  }
  if (!interview) {
    const error = new HttpError(
      "Could not find interview for the provided id.",
      404
    );
    return next(error);
  }

  const newNotification = new Notification({
    message: `Your request for the interview "${interview.title}" is rejected by the interviewer `,
    to: candidate.id,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    candidate.sentRequests.pull(interview.id);
    interview.receivedRequests.pull(candidate.id);
    candidate.notifications = [newNotification, ...candidate.notifications];
    candidate.setting.unreadNotis =candidate.setting.unreadNotis + 1;
    await interview.save({ session: sess });
    await candidate.save({ session: sess });
    await newNotification.save({ session: sess });
    await candidate.setting.save({session:sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not add candidate to interview.",
      500
    );
    return next(error);
  }
  socket.emit('notification', { userId: candidate.id, notification: newNotification });

  res.status(200).json({
    interview: interview.toObject({ getters: true }),
    responseDone: "rejected",
  });
};

const inviteCandidate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { uid } = req.body;

  let candidate;
  try {
    candidate = await User.findById(uid).populate({path:'setting',model:Setting});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a User.",
      500
    );
    return next(error);
  }

  if (!candidate) {
    const error = new HttpError(
      "Could not find candidate for the provided id.",
      404
    );
    return next(error);
  }
  const interviewId = req.params.iid;

  let interview;
  try {
    interview = await Interview.findById(interviewId);
  } catch (err) {
    const error = new HttpError(
      "Could not find interview of specified id.",
      500
    );
    return next(error);
  }
  if (!interview) {
    const error = new HttpError(
      "Could not find interview for the provided id.",
      404
    );
    return next(error);
  }
  if (interview.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to edit this interview.",
      401
    );
    return next(error);
  }

  const newNotification = new Notification({
    message: `You are invited for the interview "${interview.title}" by an interview. Open Interviews to respond.`,
    to: candidate.id,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    interview.sentRequests.addToSet(candidate.id);
    candidate.receivedRequests.addToSet(interview.id);
    candidate.notifications = [newNotification, ...candidate.notifications];
    candidate.setting.unreadNotis = candidate.setting.unreadNotis + 1;
    await interview.save({ session: sess });
    await candidate.save({ session: sess });
    await newNotification.save({ session: sess });
    await candidate.setting.save({session:sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not send request to the Candidate for interview.",
      500
    );
    return next(error);
  }

  socket.emit('notification', { userId: candidate.id, notification: newNotification });

  res.status(201).json({ interview: interview.toObject({ getters: true }) });
};

const RequestForInterview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { uid } = req.body;

  let candidate;
  try {
    candidate = await User.findById(uid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a User.",
      500
    );
    return next(error);
  }

  if (!candidate) {
    const error = new HttpError(
      "Could not find candidate for the provided id.",
      404
    );
    return next(error);
  }
  const interviewId = req.params.iid;

  let interview;
  try {
    interview = await Interview.findById(interviewId);
  } catch (err) {
    const error = new HttpError(
      "Could not find interview of specified id.",
      500
    );
    return next(error);
  }
  if (!interview) {
    const error = new HttpError(
      "Could not find interview for the provided id.",
      404
    );
    return next(error);
  }
  let interviewer;
  try {
    interviewer = await User.findById(interview.creator).populate({ path: 'setting', model: Setting });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong Could not find interviewer.",
      500
    );
    return next(error);
  }
  if (!interviewer) {
    const error = new HttpError(
      "Could not find interviewer for the provided id.",
      404
    );
    return next(error);
  }

  const newNotification = new Notification({
    message: `A candidate has requested for the interview "${interview.title}". Open interviews to view requests.`,
    to: interviewer.id,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    candidate.sentRequests.addToSet(interview.id);
    interview.receivedRequests.addToSet(candidate.id);
    interviewer.notifications = [newNotification, ...interviewer.notifications];
    interviewer.setting.unreadNotis =interviewer.setting.unreadNotis + 1;
    await interview.save({ session: sess });
    await candidate.save({ session: sess });
    await interviewer.save({session:sess});
    await interviewer.setting.save({session:sess});
    await newNotification.save({session:sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not send request to the Candidate for interview.",
      500
    );
    return next(error);
  }

  socket.emit('notification', { userId: interviewer.id, notification: newNotification });

  res.status(201).json({ interview: interview.toObject({ getters: true }) });
};

const cancelRequestForInterview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { uid } = req.body;

  let candidate;
  try {
    candidate = await User.findById(uid);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a User.",
      500
    );
    return next(error);
  }

  if (!candidate) {
    const error = new HttpError(
      "Could not find candidate for the provided id.",
      404
    );
    return next(error);
  }
  const interviewId = req.params.iid;

  let interview;
  try {
    interview = await Interview.findById(interviewId);
  } catch (err) {
    const error = new HttpError(
      "Could not find interview of specified id.",
      500
    );
    return next(error);
  }
  if (!interview) {
    const error = new HttpError(
      "Could not find interview for the provided id.",
      404
    );
    return next(error);
  }

  candidate.sentRequests.pull(interview.id);
  interview.receivedRequests.pull(candidate.id);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await interview.save({ session: sess });
    await candidate.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not cancel sent request for interview of the Candidate.",
      500
    );
    return next(error);
  }

  res.status(201).json({ interview: interview.toObject({ getters: true }) });
};

const removeCandidate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { uid } = req.body;

  let candidate;
  try {
    candidate = await User.findById(uid).populate({path:'setting',model:Setting});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a User.",
      500
    );
    return next(error);
  }

  if (!candidate) {
    const error = new HttpError(
      "Could not find candidate for the provided id.",
      404
    );
    return next(error);
  }
  const interviewId = req.params.iid;

  let interview;
  try {
    interview = await Interview.findById(interviewId);
  } catch (err) {
    const error = new HttpError(
      "Could not find interview of specified id.",
      500
    );
    return next(error);
  }
  if (!interview) {
    const error = new HttpError(
      "Could not find interview for the provided id.",
      404
    );
    return next(error);
  }
  // if (interview.creator.toString() !== req.userData.userId) {
  //     const error = new HttpError('You are not allowed to edit this interview.', 401);
  //     return next(error);
  // }
  if (!interview.candidates.includes(candidate.id)) {
    const error = new HttpError(
      "Candidate is already not added in the interview.",
      401
    );
    return next(error);
  }
  const newNotification = new Notification({
    message: `You are removed from the interview "${interview.title}" by the interview.`,
    to: candidate.id,
  });


  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    interview.candidates.pull(candidate.id);
    candidate.addedInterviews.pull(interview.id);
    interview.sentRequests.pull(candidate.id);
    candidate.notifications = [newNotification, ...candidate.notifications];
    candidate.setting.unreadNotis = candidate.setting.unreadNotis + 1;
    await interview.save({ session: sess });
    await candidate.save({ session: sess });
    await newNotification.save({ session: sess });
    await candidate.setting.save({session:sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not remove candidate from Interview.",
      500
    );
    return next(error);
  }
  socket.emit('notification', { userId: candidate.id, notification: newNotification });

  res.status(200).json({
    interview: interview.toObject({ getters: true }),
    responseDone: "removed",
  });
};

exports.getInterviewById = getInterviewById;
exports.getInterviewsByUserId = getInterviewsByUserId;
exports.createInterview = createInterview;
exports.updateInterview = updateInterview;
exports.deleteInterview = deleteInterview;
exports.AcceptInviteReq = AcceptInviteReq;
exports.rejectInviteReq = rejectInviteReq;
exports.removeCandidate = removeCandidate;
exports.cancelRequestForInterview = cancelRequestForInterview;
exports.inviteCandidate = inviteCandidate;
exports.RequestForInterview = RequestForInterview;
exports.getInterviewerRequests = getInterviewerRequests;
exports.AcceptCandidateReq = AcceptCandidateReq;
exports.RejectCandidateReq = RejectCandidateReq;
