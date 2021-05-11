const express = require('express');
const { check } = require('express-validator');

const interviewsControllers = require('../controllers/interviews-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:iid', interviewsControllers.getInterviewById);

router.get('/user/:uid', interviewsControllers.getInterviewsByUserId);

router.get('/interviewreq/:iid', interviewsControllers.getInterviewerRequests);

router.post(
  '/',
  [
    check('title')
      .not()
      .isEmpty(),
    check('title').isLength({ min: 5 }),
    check('description').isLength({ min: 15 }),
    check('fieldTitle').not().isEmpty(),
    check('date').not().isEmpty(),
    check('time').not().isEmpty(),
  ],
  interviewsControllers.createInterview
);

router.patch(
  '/:iid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('title').isLength({ min: 5 }),
    check('description').isLength({ min: 15 }),
    check('fieldTitle').not().isEmpty(),
    check('date').not().isEmpty(),
    check('time').not().isEmpty(),
  ],
  interviewsControllers.updateInterview
);

router.patch(
  '/invitecandidate/:iid',
  [
    check('uid')
      .not()
      .isEmpty()
  ],
  interviewsControllers.inviteCandidate
);

router.patch(
  '/sendinterrequest/:iid',
  [
    check('uid')
      .not()
      .isEmpty()
  ],
  interviewsControllers.RequestForInterview
);


router.patch(
  '/cancelinterreq/:iid',
  [
    check('uid')
      .not()
      .isEmpty()
  ],
  interviewsControllers.cancelRequestForInterview
);

router.patch(
  '/:iid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('title').isLength({ min: 5 }),
    check('description').isLength({ min: 15 }),
    check('fieldTitle').not().isEmpty(),
    check('date').not().isEmpty(),
    check('time').not().isEmpty(),
  ],
  interviewsControllers.updateInterview
);

router.patch(
  '/addcandidate/:iid',
  [
    check('uid')
      .not()
      .isEmpty()
  ],
  interviewsControllers.AcceptInviteReq
);

router.patch(
  '/rejectcandidate/:iid',
  [
    check('uid')
      .not()
      .isEmpty()
  ],
  interviewsControllers.rejectInviteReq
);

router.patch(
  '/removecandidate/:iid',
  [
    check('uid')
      .not()
      .isEmpty()
  ],
  interviewsControllers.removeCandidate
);

router.patch(
  '/acceptcandidatereq/:iid',
  [
    check('uid')
      .not()
      .isEmpty()
  ],
  interviewsControllers.AcceptCandidateReq
);

router.patch(
  '/rejectcandidatereq/:iid',
  [
    check('uid')
      .not()
      .isEmpty()
  ],
  interviewsControllers.RejectCandidateReq
);

router.delete('/:iid', interviewsControllers.deleteInterview);

module.exports = router;
