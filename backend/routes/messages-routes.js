const express = require('express');
const { check } = require('express-validator');

const messagesControllers = require('../controllers/messages-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:mid', messagesControllers.getMessageById);
router.get('/chat/:cid', messagesControllers.getMessagesByChatId);
router.post('/',
    fileUpload.single('image'),
    [
        check('sender').isMongoId(),
        check('receiver').isMongoId(),
    ],
    messagesControllers.createMessage
);
router.patch('/:mid', messagesControllers.deleteMessage);

module.exports = router;
