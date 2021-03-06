const express = require('express');
const { check } = require('express-validator');

const certificatesControllers = require('../controllers/certificates-controllers');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('.././middleware/check-admin');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.use(checkAuth);

router.get('/:cid', certificatesControllers.getCertificateById);
router.get('/user/:uid', certificatesControllers.getCertificatesByUserId);
router.get('/', certificatesControllers.getAllCertificates);

router.post(
    '/',
    fileUpload.single('file'),
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
        check('title')
        .not()
        .isEmpty(),
        check('title').isLength({ min: 5 }),
        check('description').isLength({ min: 15 }),
        check('institute').isLength({ min: 10 }),
        check('fieldTitle').not().isEmpty(),
    ],
    certificatesControllers.updateCertificate
);
router.delete('/:cid', certificatesControllers.deleteCertificate);

router.use(checkAdmin);

router.patch(
    '/accept/:cid',
    certificatesControllers.acceptCertificate
);

router.patch(
    '/reject/:cid',
    certificatesControllers.rejectCertificate
);
// router.post('/uploadImage',
//    fileUpload.single('image'),
//   [
//     check('userId').isMongoId(),
//   ],
//   certificatesControllers.uploadCertificate
// );
module.exports = router;
