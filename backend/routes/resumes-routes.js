const express = require("express");
const { check } = require("express-validator");

const resumesControllers = require("../controllers/resumes-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);

router.get("/:rid", resumesControllers.getResumeById);
router.get("/user/:uid", resumesControllers.getResumeByUserId);
router.get("/resume/:name", resumesControllers.getResumeByUserName);

router.post(
  "/",
  [
    check("firstName").isLength({ min: 3 }),
    check("dob").isDate,
    check("phone").isMobilePhone,
    check("email").isEmail,
    check("city").notEmpty,
    check("maxEducation").notEmpty,
    check("experience").isNumeric({ min: 0 }),
    check("fieldId").notEmpty,
  ],
  resumesControllers.createResume
);

router.patch(
  "/:rid",
  [
    check('firstname').isLength({min : 3}),
    check('lastname').isLength({min : 3}),
    check('country').not().isEmpty(),
    check('dob').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('phone').not().isEmpty(),
    check('city').not().isEmpty(),
    check('address').not().isEmpty(),
    
  
  ],
  resumesControllers.updateResume
);

router.delete("/:rid", resumesControllers.deleteResume);

module.exports = router;
