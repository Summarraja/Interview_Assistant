const express = require('express');
const { check } = require('express-validator');

const resumesControllers = require('../controllers/resumes-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:rid', resumesControllers.getResumeById);
router.get('/user/:uid', resumesControllers.getResumeByUserId);

router.post(
    '/',
    [
        check('firstName').isLength({ min: 3 }),
        check('dob').isDate,
        check('phone').isMobilePhone,
        check('email').isEmail,
        check('city').notEmpty,
        check('maxEducation').notEmpty,
        check('experience').isNumeric({min:0}),
        check('fieldId').notEmpty,
    ],
    resumesControllers.createResume
);

router.patch(
    '/:rid',
    [
        check('firstName').isLength({ min: 3 }),
        check('dob').isDate,
        check('phone').isMobilePhone,
        check('email').isEmail,
        check('city').notEmpty,
        check('maxEducation').notEmpty,
        check('experience').isNumeric({min:0}),
        check('fieldId').notEmpty,
    ],
    resumesControllers.updateResume
);

router.delete('/:rid', resumesControllers.deleteResume);


module.exports = router;
