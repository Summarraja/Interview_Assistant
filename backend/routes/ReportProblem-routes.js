const express = require('express');
const { check } = require('express-validator');

const ReportProblemsControllers = require('../controllers/ReportProblem-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/unanswer', ReportProblemsControllers.getunansweredProblems )
router.get('/:pid', ReportProblemsControllers.getProblemById);
router.get('/', ReportProblemsControllers.getAllProblems);

// router.use(checkAuth);

router.post(
    '/',
    [
        check('title').isLength({ min: 10 }),
        // check('answer').isLength({ min: 10 }),
        check('description').isLength({ min: 10 })
    ],
    ReportProblemsControllers.createProblem
);

router.patch(
    '/:pid',
    [
        check('title').isLength({ min: 10 }),
        check('description').isLength({ min: 10 })
    ],
    ReportProblemsControllers.updateProblem
);

router.delete('/:pid', ReportProblemsControllers.deleteProblem);

module.exports = router;
