const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/clothingItem");
const mainRouter = require("./routes/index");
const { JWT_SECRET } = require("./utils/config");
// const { auth } = require("../middlewares/auth");

const app = express();
app.use(express.json());
const { PORT = 3001 } = process.env;

app.use((req, res, next) => {
  req.user = {
    _id: JWT_SECRET,
  };

  next();
});

// CORS

app.use(cors());

// ROUTES

app.use(routes);
app.use("/", mainRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`App is listening at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

module.exports.createClothingItem = (req) => {
  const { owner } = req.user._id;
  console.log(owner); // _id will become accessible
};
