const express = require('express');
const { check } = require('express-validator');

const settingsControllers = require('../controllers/settings-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:iid', settingsControllers.getSettingById);

router.get('/user/:uid', settingsControllers.getSettingByUserId);


router.post(
    '/',
    [
      check('notiStatus')
        .not()
        .isEmpty(),
      check('status').isIn( ['busy', 'available','away']),
      check('role').isIn(['admin', 'interviewer','candidate']),
    ],
    settingsControllers.createSettings
  );

  router.patch(
    '/role/:sid',
    [
        check('role').isIn(['admin', 'interviewer','candidate']),
    ],
      settingsControllers.SwitchRole
);

// router.patch(
//     '/status/:sid',
//     [
//         check('status').isIn(['busy', 'available','away']),
//     ],
//       settingsControllers.SwitchStatus
// );


router.delete('/:sid',  settingsControllers.deleteSettings);

  

module.exports = router;