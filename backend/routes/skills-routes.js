const express = require('express');
const { check } = require('express-validator');

const skillsControllers = require('../controllers/skills-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/id/:sid', skillsControllers.getSkillById);
router.get('/title/:st', skillsControllers.getSkillByTitle);

router.post(
    '/',
    [
        check('title')
            .notEmpty()
            .isLength({ min: 5 }),
        check('description').isLength({ min: 10 })
    ],
    skillsControllers.createSkill
);

router.patch(
    '/:st',
    [
        check('title')
            .not()
            .isEmpty()
        .isLength({ min: 5 }),
        check('description').isLength({ min: 10 })
    ],
    skillsControllers.updateSkill
);

router.delete('/:st', skillsControllers.deleteSkill);


module.exports = router;
