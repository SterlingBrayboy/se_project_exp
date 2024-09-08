const router = require("express").Router();

// const { likeItem, unlikeItem } = require("../controllers/clothingItems");

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// const clothingItem = require("../models/clothingItem");

//CRUD

//Create
router.post("/", createItem);

//Read

router.get("/", getItems);

//Update

router.put("/:itemId", updateItem);

//Like
router.put("/items/:itemId/likes", likeItem);

//Unlike
router.delete("/items/:itemId/likes", unlikeItem);

//Delete
router.delete("/:itemId", deleteItem);

module.exports = router;
