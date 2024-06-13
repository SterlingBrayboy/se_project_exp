const User = require("../models/user");
const router = require("../routes");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      throw Error("AHHH!");
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = { getUsers };
