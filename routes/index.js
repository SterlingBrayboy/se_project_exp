const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const { NOT_FOUND_CODE } = require("../utils/errors");

router.post("/signin", auth, login);
router.post("/signup", createUser);
router.use("/items", auth, clothingItem);
router.use("/users", auth, userRouter);
router.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: "Router not found" });
});

module.exports = router;
