const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
// const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
  '/signup',
  // fileUpload.single('image'),
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
    .isIn(['male','female','other'])
  ],
  usersController.signup
);

router.post('/login', usersController.login);


module.exports = router;
