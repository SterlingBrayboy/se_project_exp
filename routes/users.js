const router = require("express").Router();
const { updateProfile, getCurrentUser } = require("../controllers/users");
// const { celebrate } = require("celebrate");
const { validateUserId } = require("../middlewares/validation");
const { auth } = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserId, updateProfile);

module.exports = router;
