const express = require('express');
const { check } = require('express-validator');

const emotionsControllers = require('../controllers/emotionStats-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:iid', emotionsControllers.getEmotionStatsbyInterviewId);

router.post('/', emotionsControllers.createOrUpdateEmotionStats);

module.exports = router;
