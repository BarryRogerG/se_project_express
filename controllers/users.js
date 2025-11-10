const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

// GET /users - get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    return next(err);
  }
};

// GET /users/me - get current user
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    return next(err);
  }
};

// GET /users/:userId - get user by id
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({
      ...userObj,
      data: userObj,
      test: userObj.name,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    return next(err);
  }
};

// POST /users - create a new user
const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!name || !avatar || !email || !password) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });
    const userObj = user.toObject();
    delete userObj.password;
    return res.status(201).json(userObj);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid request data" });
    }
    return next(err);
  }
};

// PATCH /users/me - update profile
const updateCurrentUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid request data" });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    return next(err);
  }
};

// POST /signin - user login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ token });
  } catch (err) {
    if (err.status === 401) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    return next(err);
  }
};

module.exports = {
  getUsers,
  getCurrentUser,
  getUserById,
  createUser,
  updateCurrentUser,
  login,
};
