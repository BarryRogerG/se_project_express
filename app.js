const express = require("express");
const mongoose = require("mongoose");
const { ERROR_CODE } = require("./utils/errors");

const app = express();

const { PORT = 3001 } = process.env;

// Connect to the database
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// Middleware
app.use(express.json());

// Temporary authorization middleware
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133", // placeholder - will be replaced with actual test user _id
  };
  next();
});

// Routes
app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingItems"));

// Handle non-existent resources
app.use((req, res) => {
  res
    .status(ERROR_CODE.NOT_FOUND)
    .send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
