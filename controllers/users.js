const User = require("../models/user");
// const jwt = require("jsonwebtoken");

const {
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
  INTERNAL_SERVICE_ERROR_CODE,
  // UNAUTHORIZED_CODE,
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

  User.create({ name, avatar, email, password })
    .then((user) => res.status(201).send(user))
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

// userSchema.statics.findUserByCredentials = function (email, password) {
//   return this.findOne({ email }).then((user) => {
//     if (!user) {
//       return Promise.reject(new Error('Incorrect email or password'));
//     }
//     // Assume you use bcrypt to check password
//     return bcrypt.compare(password, user.password).then((matched) => {
//       if (!matched) {
//         return Promise.reject(new Error('Incorrect email or password'));
//       }
//       return user;
//     });
//   });
// };

// const login = (req, res) => {
// const { email, password } = req.body;
//   User.findUserByCredentials(email, password)
//     .then((user) => {
//        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
//        expiresIn: "7d",
//        res.send({ token });
//        });
//      .catch((err) => {
//       console.error(err);
//       return res.status(UNAUTHORIZED_CODE).send({ message: "Unauthorization Error"});
//     });
// };

module.exports = { getUsers, createUser, getUser };
