const express = require('express');
const { check } = require('express-validator');

const settingsControllers = require('../controllers/settings-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:iid', settingsControllers.getSettingById);

router.get('/user/:uid', settingsControllers.getSettingByUserId);

router.get('/notifications/:uid', settingsControllers.getNotifications);

router.get('/blockedUsers/:uid', settingsControllers.getBlockedListByUserId )

router.post(
  '/',
  [
    check('notiStatus')
      .not()
      .isEmpty(),
    check('status').isIn(['busy', 'available', 'away']),
    check('role').isIn(['admin', 'interviewer', 'candidate']),
  ],
  settingsControllers.createSettings
);

router.patch(
  '/role/:sid',
  [
    check('role').isIn(['Admin', 'Interviewer', 'Candidate']),
  ],
  settingsControllers.SwitchRole
);
router.patch(
  '/openChat/:uid',

  settingsControllers.openChat
);
router.patch(
  '/openNotifications/:uid',

  settingsControllers.openNotifications
);

router.patch(
  '/blockUser/:sid',
  [
    check('uid').isMongoId()
  ],
  settingsControllers.blockUser
);

router.patch(
  '/UnblockUser/:sid',
  [
    check('uid').isMongoId()
  ],
  settingsControllers.UnblockUser
);

// router.patch(
//     '/status/:sid',
//     [
//         check('status').isIn(['busy', 'available','away']),
//     ],
//       settingsControllers.SwitchStatus
// );


router.delete('/:sid', settingsControllers.deleteSettings);



module.exports = router;