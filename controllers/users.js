const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  INTERNAL_SERVICE_ERROR_CODE,
  CONFLICT_CODE,
  UNAUTHORIZED_CODE,
} = require("../utils/errors");

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(200).send(users))
//     .catch((err) => {
//       console.error(err);
//       return res
//         .status(INTERNAL_SERVICE_ERROR_CODE)
//         .send({ message: "Internal Service Error" });
//     });
// };

const createUser = (req, res) => {
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
        return res.status(BAD_REQUEST_CODE).send({ message: "Invalid data" });
      }
      if (err.statusCode === CONFLICT_CODE) {
        return res
          .status(CONFLICT_CODE)
          .send({ message: "The user with the provided email already exists" });
      }
      return res
        .status(INTERNAL_SERVICE_ERROR_CODE)
        .send({ message: "Internal Service Error" });
    });
};

// const getUser = (req, res) => {
//   const { userId } = req.params;
//   User.findById(userId)
//     .orFail()
//     .then((user) => res.status(200).send(user))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND_CODE).send({ message: "Invalid data" });
//       }
//       if (err.name === "CastError") {
//         return res.status(BAD_REQUEST_CODE).send({ message: "User not found" });
//       }
//       return res
//         .status(INTERNAL_SERVICE_ERROR_CODE)
//         .send({ message: "Internal Service Error" });
//     });
// };

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_CODE)
      .send({ message: "The password and email fields are required" });
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED_CODE)
          .send({ message: "Incorrect email or password" });
      }
      // return res.status(BAD_REQUEST_CODE).send({ message: "Invalid data" });
      return res
        .status(INTERNAL_SERVICE_ERROR_CODE)
        .send({ message: "Internal Service Error" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_CODE).send({ message: "User Not Found" });
      }
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_CODE).send({ message: "User Not Found" });
      }
      return res
        .status(INTERNAL_SERVICE_ERROR_CODE)
        .send({ message: "Internal Service Error" });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(NOT_FOUND_CODE).send({ message: "User Not Found" });
      }
      return res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST_CODE).send({ message: "Invalid data" });
      }
      return res
        .status(INTERNAL_SERVICE_ERROR_CODE)
        .send({ message: "Internal Service Error" });
    });
};

module.exports = {
  // getUsers,
  createUser,
  // getUser,
  login,
  getCurrentUser,
  updateProfile,
};
