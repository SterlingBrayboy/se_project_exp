const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/clothingItem");
const mainRouter = require("./routes/index");

const app = express();
app.use(express.json());
const { PORT = 3001 } = process.env;

app.use((req, _res, next) => {
  // eslint-disable-next-line no-unused-vars
  req.user = {
    _id: "66c826882e5d7e29a99d57bd", // paste the _id of the test user created in the previous step
  };
  next();
});

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

module.exports.createClothingItem = (req, _res) => {
  // eslint-disable-next-line no-unused-vars
  console.log(req.user._id); // _id will become accessible
};
