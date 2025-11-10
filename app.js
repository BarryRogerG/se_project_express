const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
const { handleError, handleNotFound } = require("./utils/errors");

const app = express();

const { PORT = 3001, MONGODB_URI = "mongodb://127.0.0.1:27017/wtwr_db" } =
  process.env;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.user = { _id: "5d8b8592978f8bd833ca8133" };
  next();
});

app.use("/", routes);

app.use(handleNotFound);
app.use(handleError);

const startServer = () => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening at port ${PORT}`);
  });
};

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to MongoDB");
    startServer();
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to connect to MongoDB", err);
    startServer();
  });
