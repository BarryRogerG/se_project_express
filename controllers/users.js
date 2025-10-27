const User = require("../models/user");
const { ERROR_CODE } = require("../utils/errors");

// Get all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// Get user by ID
const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = ERROR_CODE.NOT_FOUND;
      throw error;
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({ message: "Invalid user ID" });
      }
      if (err.statusCode === ERROR_CODE.NOT_FOUND) {
        return res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: "User not found" });
      }
      res
        .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// Create a new user
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({ message: "Invalid data" });
      }
      res
        .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
