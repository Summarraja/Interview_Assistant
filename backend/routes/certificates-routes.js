const express = require('express');
const { check } = require('express-validator');

const certificatesControllers = require('../controllers/certificates-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:cid', certificatesControllers.getCertificateById);
router.get('/user/:uid', certificatesControllers.getCertificatesByUserId);

router.post(
    '/',
    //image
    [
        check('title').isLength({ min: 5 }),
        check('description').isLength({ min: 10 }),
        check('institute').isLength({ min: 10 }),
        check('fieldId').notEmpty,
    ],
    certificatesControllers.createCertificate
);

router.patch(
    '/:cid',
    [
        check('title').isLength({ min: 5 }),
        check('description').isLength({ min: 10 }),
        check('institute').isLength({ min: 10 }),
        check('fieldId').notEmpty,
    ],
    certificatesControllers.updateCertificate
);

router.delete('/:cid', certificatesControllers.deleteCertificate);


module.exports = router;
