const express = require('express');
const { check } = require('express-validator');

const messagesControllers = require('../controllers/messages-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:mid', messagesControllers.getMessageById);
router.get('/chat/:cid', messagesControllers.getMessagesByChatId);


module.exports = router;
