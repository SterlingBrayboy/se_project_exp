const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("express").Router();
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");

const app = express();
app.use(express.json());
const { PORT = 3001 } = process.env;

// ERRORS

const { errors } = require("celebrate");

// CORS

app.use(cors());

app.use("/", mainRouter);
app.use(errorHandler);

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

module.exports = router;
