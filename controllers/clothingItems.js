const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.status(201).send({ item });
    })
    .catch((err) => {
      console.error("Error:", err);
      res.status(400).send({ message: "Error from createItem", err });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Error from getItems", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(500).send({ message: "Error from updateItem", e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(`deleteItem called with itemId: ${itemId}`);

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        console.log("No item found with given ID");
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send({ message: "Item deleted" });
    })
    .catch((err) => {
      console.error("Delete Item Error:", err); // Log the error
      res.status(500).send({ message: "Internal server error" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  console.log(`likeItem called with itemId: ${itemId}`);

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .then((item) => {
      if (!item) {
        console.log("No item found with given ID");
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error("Like Item Error:", err); // Log the error
      res.status(500).send({ message: "Internal server error" });
    });
};
//...

const unlikeItem = (req, res) => {
  const { itemId } = req.params.itemId;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.send(item);
    })
    .catch((err) => {
      console.error("Unlike Item Error:", err); // Log the error
      res.status(500).send({ message: "Internal server error" });
    });
};
//...

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
