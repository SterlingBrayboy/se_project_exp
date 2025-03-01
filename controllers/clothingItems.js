const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const { BAD_REQUEST_CODE } = require("../utils/errors/bad-request-err");
const { NOT_FOUND_CODE } = require("../utils/errors/not-found-err");
const {
  INTERNAL_SERVICE_ERROR_CODE,
} = require("../utils/errors/internal-service-err");
const { FORBIDDEN_CODE } = require("../utils/errors/forbidden-err");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST_CODE("Invalid data"));
      }
      next(new INTERNAL_SERVICE_ERROR_CODE("Internal server error"));
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      next(new INTERNAL_SERVICE_ERROR_CODE("Error from getItems"));
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    next(new BAD_REQUEST_CODE("Invalid ID format"));
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        next(new NOT_FOUND_CODE("Item not found"));
      }
      if (!item.owner.equals(req.user._id)) {
        next(new FORBIDDEN_CODE("Hands Off"));
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        res.status(200).send({ data: deletedItem });
      });
    })
    .catch(() => {
      next(new INTERNAL_SERVICE_ERROR_CODE("Error from deleteItem"));
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    next(new BAD_REQUEST_CODE("Invalid ID format"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        next(new NOT_FOUND_CODE("Item not found"));
      }
      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BAD_REQUEST_CODE("Item not found"));
      }
      next(new INTERNAL_SERVICE_ERROR_CODE("Internal server error"));
    });
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    next(new BAD_REQUEST_CODE("Invalid ID format"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Card ID not found");
      error.statusCode = NOT_FOUND_CODE;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.statusCode === NOT_FOUND_CODE) {
        next(new NOT_FOUND_CODE("Item not found"));
      }
      next(new INTERNAL_SERVICE_ERROR_CODE("Internal server error"));
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
