const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const {
  validateUserAuth,
  validateInfoBody,
} = require("../middlewares/validation");
const { login, createUser } = require("../controllers/users");
const { NOT_FOUND_CODE } = require("../utils/errors/not-found-err");

router.post("/signin", validateUserAuth, login);
router.post("/signup", validateInfoBody, createUser);
router.use("/items", clothingItem);
router.use("/users", userRouter);
router.use((next) => {
  next(new NOT_FOUND_CODE("Router not found"));
});

module.exports = router;
