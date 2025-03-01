const express = require("express");

const router = express.Router();
const { auth } = require("../middlewares/auth");
// const { celebrate } = require("celebrate");
const { validateCardBody } = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// Create
// router.post("/", auth, createItem);
router.post("/", auth, validateCardBody, createItem);

// Read
router.get("/", getItems);

// Like
router.put("/:itemId/likes", validateCardBody, auth, likeItem);

// Unlike
router.delete("/:itemId/likes", validateCardBody, auth, unlikeItem);

// Delete
router.delete("/:itemId", validateCardBody, auth, deleteItem);

module.exports = router;
