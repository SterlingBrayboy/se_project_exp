const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

// POST route to create a new item
app.post("/items", (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "An error occurred" });
    });
});

const routes = require("./routes");
app.use(express.json());
app.use(routes);

app.use("/", mainRouter);

app.use((req, res, next) => {
  req.user = {
    _id: "66c826882e5d7e29a99d57bd", // paste the _id of the test user created in the previous step
  };
  next();
});

app.listen(PORT, () => {
  console.log(`Server is runnning on port ${PORT}`);
  console.log("This is working");
});

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id); // _id will become accessible
};
