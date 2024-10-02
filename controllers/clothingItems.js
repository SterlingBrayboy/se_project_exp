const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  INTERNAL_SERVICE_ERROR_CODE,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.status(201).send({ item });
    })
    .catch((err) => {
      console.error("Error:", err);
      res
        .status(BAD_REQUEST_CODE)
        .send({ message: "Error from createItem", err });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res
        .status(INTERNAL_SERVICE_ERROR_CODE)
        .send({ message: "Error from getItems", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      res
        .status(INTERNAL_SERVICE_ERROR_CODE)
        .send({ message: "Error from updateItem", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(`deleteItem called with itemId: ${itemId}`);

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    res.status(BAD_REQUEST_CODE).send({ message: "Invalid ID format" });
  }

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("Card ID not found");
      error.statusCode = NOT_FOUND_CODE;
      throw error;
    })
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }
      return res.status(200).send({ message: "Item deleted" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // 400 — invalid data passed to the methods
        res.status(BAD_REQUEST_CODE).send({ message: "Invalid item ID" });
      } else if (err.statusCode === NOT_FOUND_CODE) {
        // 404 — the requested ID or URL doesn't exist
        res.status(NOT_FOUND_CODE).send({ message: err.message });
      }
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  console.log(`likeItem called with itemId: ${itemId}`);

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST_CODE).send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .then((item) => {
      if (!item) {
        console.log("No item found with given ID");
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error("Like Item Error:", err); // Log the error
      res
        .status(INTERNAL_SERVICE_ERROR_CODE)
        .send({ message: "Internal server error" });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST_CODE).send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Card ID not found");
      error.statusCode = NOT_FOUND_CODE;
      throw error;
    })
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // 400 — invalid data passed to the methods
        res.status(BAD_REQUEST_CODE).send({ message: "Invalid item ID" });
      } else if (err.statusCode === NOT_FOUND_CODE) {
        // 404 — the requested ID or URL doesn't exist
        res.status(NOT_FOUND_CODE).send({ message: err.message });
      }
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
