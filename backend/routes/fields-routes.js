const express = require('express');
const { check } = require('express-validator');

const fieldsControllers = require('../controllers/fields-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:fid', fieldsControllers.getFieldById);
router.get('/title/:ft', fieldsControllers.getFieldByTitle);


router.post(
  '/',
  [
    check('title')
      .not()
      .isEmpty(),
    check('title').isLength({ min: 5 }),
    check('description').isLength({ min: 10 })
  ],
  fieldsControllers.createField
);

router.patch(
  '/:ft',
  [
    check('title')
      .not()
      .isEmpty(),
    check('title').isLength({ min: 5 }),
    check('description').isLength({ min: 10 })
  ],
  fieldsControllers.updateField
);

router.delete('/:ft', fieldsControllers.deleteField);

router.patch(
    '/addSkill:ft',
    [
      check('skillId')
        .not()
        .isEmpty()
    ],
    fieldsControllers.addSkill
  );
  router.patch(
    '/removeSkill:ft',
    [
      check('skillId')
        .not()
        .isEmpty()
    ],
    fieldsControllers.removeSkill
  );

module.exports = router;
