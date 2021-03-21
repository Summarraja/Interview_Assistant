const express = require('express');
const { check } = require('express-validator');

const certificatesControllers = require('../controllers/certificates-controllers');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('.././middleware/check-admin');
// const fileUpload = require('../middleware/file-upload');


const router = express.Router();

router.use(checkAuth);

router.get('/:cid', certificatesControllers.getCertificateById);
router.get('/user/:uid', certificatesControllers.getCertificatesByUserId);

router.post(
    '/',
  //  fileUpload.single('image'),
    [
        check('title')
        .not()
        .isEmpty(),
        check('title').isLength({ min: 5 }),
        check('description').isLength({ min: 15 }),
        check('institute').isLength({ min: 10 }),
        check('fieldTitle').not().isEmpty(),
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

router.use(checkAdmin);

router.patch(
    '/:cid/accept',
    certificatesControllers.acceptCertificate
);

router.patch(
    '/:cid/reject',
    certificatesControllers.rejectCertificate
);

module.exports = router;
