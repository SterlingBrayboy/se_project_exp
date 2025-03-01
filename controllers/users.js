const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const { BAD_REQUEST_CODE } = require("../utils/errors/bad-request-err");
const { NOT_FOUND_CODE } = require("../utils/errors/not-found-err");
const {
  INTERNAL_SERVICE_ERROR_CODE,
} = require("../utils/errors/internal-service-err");
const { CONFLICT_CODE } = require("../utils/errors/conflict-err");
const { UNAUTHORIZED_CODE } = require("../utils/errors/unauthorized-err");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error(
          "The user with the provided email already exists"
        );
        error.statusCode = CONFLICT_CODE;
        throw error;
      }

      return bcrypt.hash(password, 10).then((hash) =>
        User.create({
          name,
          avatar,
          email,
          password: hash,
        })
      );
    })
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).json(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST_CODE("Invalid data"));
      }
      if (err.statusCode === CONFLICT_CODE) {
        next(
          new CONFLICT_CODE("The user with the provided email already exists")
        );
      }
      next(new INTERNAL_SERVICE_ERROR_CODE("Internal Service Error"));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BAD_REQUEST_CODE("The password and email fields are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        next(new UNAUTHORIZED_CODE("Incorrect email or password"));
      }
      next(new INTERNAL_SERVICE_ERROR_CODE("Internal Service Error"));
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NOT_FOUND_CODE("User Not Found"));
      }
      if (err.name === "CastError") {
        next(new BAD_REQUEST_CODE("User Not Found"));
      }
      next(new INTERNAL_SERVICE_ERROR_CODE("Internal Service Error"));
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        next(new NOT_FOUND_CODE("User Not Found"));
      }
      return res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BAD_REQUEST_CODE("Invalid data"));
      }
      next(new INTERNAL_SERVICE_ERROR_CODE("Internal Service Error"));
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
