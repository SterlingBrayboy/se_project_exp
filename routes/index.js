const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
// const { celebrate } = require("celebrate");
const { validateUserAuth } = require("../middlewares/validation");
const { login, createUser } = require("../controllers/users");
const { NOT_FOUND_CODE } = require("../utils/errors");

router.post("/signin", validateUserAuth, login);
router.post("/signup", validateUserAuth, createUser);
router.use("/items", clothingItem);
router.use("/users", userRouter);
router.use((req, res) => {
  next(new NOT_FOUND_CODE("Router not found"));
});

module.exports = router;
