const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

const usersController = require('../controllers/users-controllers');
 const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);
router.get('/:uid', usersController.getUserData);

router.post('/sendCode',
  [
    check('email').normalizeEmail().isEmail()
  ],
  usersController.sendCode
);

router.post('/verifyCode',
  [
    check('email').normalizeEmail().isEmail(),
    check('code').isLength(4)
  ],
  usersController.verifyCode
);


router.post('/signup',
  [
    check('firstname').not().isEmpty(),
    check('lastname').not().isEmpty(),
    check('country').not().isEmpty(),
    check('dob').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('phone').not().isEmpty(),
    check('password').isLength({ min: 6 }),
    check('address').not().isEmpty(),
    check('gender').not().isEmpty()
      .isIn(['male', 'female', 'other'])
  ],
  usersController.signup
);

router.post('/login', usersController.login);
router.use(checkAuth);

router.post('/uploadImage',
   fileUpload.single('image'),
  [
    check('userId').isMongoId(),
  ],
  usersController.uploadImage
);

module.exports = router;
