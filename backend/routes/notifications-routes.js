const express = require('express');
const { check } = require('express-validator');

const notificationsControllers = require('../controllers/notifications-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:nid', notificationsControllers.getNotificationById);
router.get('/', notificationsControllers.getAllNotifications);

router.post(
    '/',
    [
        check('message').isLength({ min: 10 }),
        check('time').isDate(),
        check('to').isMongoId()
    ],
    notificationsControllers.createNotification
);

router.patch(
    '/:nid',
    [
        check('message').isLength({ min: 10 }),
        check('time').isDate(),
        check('to').isMongoId()
    ],
    notificationsControllers.markAsRead
);

router.delete('/:nid', notificationsControllers.deleteNotification);


module.exports = router;
