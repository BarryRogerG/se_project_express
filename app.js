const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const routes = require("./routes");
const User = require("./models/user");
const { handleError, handleNotFound } = require("./utils/errors");

const app = express();

const { PORT = 3001, MONGODB_URI = "mongodb://127.0.0.1:27017/wtwr_db" } =
  process.env;

const DEFAULT_USER_ID = "5d8b8592978f8bd833ca8133";
const DEFAULT_USER_EMAIL = "test@example.com";
const DEFAULT_USER_AVATAR =
  "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Sneakers.png?etag=3efeec41c1c78b8afe26859ca7fa7b6f";

const ensureDefaultUser = async () => {
  const existingUser = await User.findById(DEFAULT_USER_ID);
  if (existingUser) {
    return;
  }

  const hashedPassword = await bcrypt.hash("default-password", 10);
  await User.create({
    _id: DEFAULT_USER_ID,
    name: "test",
    avatar: DEFAULT_USER_AVATAR,
    email: DEFAULT_USER_EMAIL,
    password: hashedPassword,
  });
};

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (!req.user) {
    req.user = { _id: DEFAULT_USER_ID };
  }
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
    ensureDefaultUser()
      .then(() => {
        startServer();
      })
      .catch((seedErr) => {
        // eslint-disable-next-line no-console
        console.error("Failed to seed default user", seedErr);
        startServer();
      });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to connect to MongoDB", err);
    startServer();
  });
