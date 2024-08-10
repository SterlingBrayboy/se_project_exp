const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");

router.get("/", (req, res) => console.log("GET users"));
router.get("/:userId", getUser);
router.post("/", createUser);

module.exports = router;
