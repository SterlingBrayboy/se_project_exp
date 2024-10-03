const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const { NOT_FOUND_CODE } = require("../utils/errors");

router.use("/items", clothingItem);
// router.use("/likes", userRouter);
router.use("/users", userRouter);
router.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: "Router not found" });
});

module.exports = router;
