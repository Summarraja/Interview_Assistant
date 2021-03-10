const express = require('express');
const { check } = require('express-validator');

const faqsControllers = require('../controllers/faqs-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:fid', faqsControllers.getFaqById);
router.get('/', faqsControllers.getAllFaqs);

// router.use(checkAuth);
router.post(
    '/',
    [
        check('question').isLength({ min: 10 }),
        check('answer').isLength({ min: 10 })
    ],
    faqsControllers.createFaq
);

router.patch(
    '/:fid',
    [
        check('question').isLength({ min: 10 }),
        check('answer').isLength({ min: 10 })
    ],
    faqsControllers.updateFaq
);

router.delete('/:fid', faqsControllers.deleteFaq);


module.exports = router;
