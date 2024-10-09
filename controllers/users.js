const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  INTERNAL_SERVICE_ERROR_CODE,
  UNAUTHORIZED_CODE,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVICE_ERROR_CODE)
        .send({ message: "Internal Service Error" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).json(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_CODE).send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVICE_ERROR_CODE)
        .send({ message: "Internal Service Error" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_CODE).send({ message: "Invalid data" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_CODE).send({ message: "User not found" });
      }
      return res
        .status(INTERNAL_SERVICE_ERROR_CODE)
        .send({ message: "Internal Service Error" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(UNAUTHORIZED_CODE)
        .send({ message: "Unauthorization Error" });
    });
};

// const getCurrentUser = (req, res) => {};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    req.params.userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(NOT_FOUND_CODE).send({ message: "User Not Found" });
      }
      res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === "Validation Error") {
        res.status(BAD_REQUEST_CODE).send("Invalid data");
      }
      return res
        .status(INTERNAL_SERVICE_ERROR_CODE)
        .send({ message: "Internal Service Error" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  login,
  // getCurrentUser,
  updateProfile,
};
