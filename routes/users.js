const router = require("express").Router();
const { updateProfile } = require("../controllers/users");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);

// router.get('/users/me', getCurrentUser);
router.patch("/users/me", updateProfile);

module.exports = router;
