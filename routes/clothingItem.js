const express = require("express");

const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  validateCardBody,
  validateItemId,
} = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// Create
router.post("/", auth, validateCardBody, createItem);

// Read
router.get("/", getItems);

// Like
router.put("/:itemId/likes", validateItemId, auth, likeItem);

// Unlike
router.delete("/:itemId/likes", validateItemId, auth, unlikeItem);

// Delete
router.delete("/:itemId", validateItemId, auth, deleteItem);

module.exports = router;
