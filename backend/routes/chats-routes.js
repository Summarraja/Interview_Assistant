const express = require('express');
const { check } = require('express-validator');

const chatControllers = require('../controllers/chats-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:uid', chatControllers.getChatsByUserId);

router.post('/', chatControllers.markRead);

router.delete('/:cid', chatControllers.deleteChat);

module.exports = router;
