const express = require("express");

const router = express.Router();
const { auth } = require("../middlewares/auth");
const { validateCardBody } = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// Create
router.post("/", auth, createItem);
router.post("/", auth, validateCardBody, createItem);

// Read
router.get("/", getItems);

// Like
router.put("/:itemId/likes", auth, likeItem);

// Unlike
router.delete("/:itemId/likes", auth, unlikeItem);

// Delete
router.delete("/:itemId", auth, deleteItem);

module.exports = router;
