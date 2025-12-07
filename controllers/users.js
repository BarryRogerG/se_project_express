const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  CREATED,
} = require("../utils/constants");
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");

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
      return next(new NotFoundError("User not found"));
    }
    return res.json(user);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid ID format"));
    }
    return next(err);
  }
};

// POST /signup - create a new user
const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    // Validation middleware handles input validation, but we still check for duplicates
    const existingByEmail = await User.findOne({ email });
    if (existingByEmail) {
      return next(new ConflictError("User already exists"));
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
    return res.status(CREATED).json(userObj);
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError("User already exists"));
    }
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid request data"));
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
      return next(new NotFoundError("User not found"));
    }

    return res.json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid request data"));
    }
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid ID format"));
    }
    return next(err);
  }
};

// POST /signin - user login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation middleware handles input validation
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'super-strong-secret', {
      expiresIn: "7d",
    });

    return res.json({ token });
  } catch (err) {
    if (err.status === 401) {
      return next(new UnauthorizedError("Incorrect email or password"));
    }
    return next(err);
  }
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  updateCurrentUser,
  login,
};
