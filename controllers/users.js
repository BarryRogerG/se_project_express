const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND } = require("../utils/constants");

// GET /users - get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    return next(err);
  }
};

// GET /users/:_id - get user by ID
const getUserById = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const user = await User.findById(_id).orFail();
    return res.json(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }
    return next(err);
  }
};

// POST /users - create a new user
const createUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const newUser = await User.create({ name, avatar });
    return res.status(201).json(newUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid request data" });
    }
    return next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
