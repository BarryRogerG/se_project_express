const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  CREATED,
  UNAUTHORIZED,
} = require("../utils/constants");

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
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid ID format" });
    }
    return next(err);
  }
};

// POST /signup - create a new user
const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!name || !avatar || !email || !password) {
      return res.status(BAD_REQUEST).json({ message: "Invalid request data" });
    }

    if (
      typeof name !== "string" ||
      typeof avatar !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(BAD_REQUEST).json({ message: "Invalid request data" });
    }

    const trimmedName = name.trim();
    const trimmedAvatar = avatar.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (
      !trimmedName.length ||
      !trimmedAvatar.length ||
      !trimmedEmail.length ||
      !trimmedPassword.length
    ) {
      return res.status(BAD_REQUEST).json({ message: "Invalid request data" });
    }

    if (!validator.isEmail(trimmedEmail)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid request data" });
    }

    const existingByEmail = await User.findOne({ email: trimmedEmail });
    if (existingByEmail) {
      return res.status(CONFLICT).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    const user = await User.create({
      name: trimmedName,
      avatar: trimmedAvatar,
      email: trimmedEmail,
      password: hashedPassword,
    });
    const userObj = user.toObject();
    delete userObj.password;
    return res.status(CREATED).json(userObj);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(CONFLICT).json({ message: "User already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid request data" });
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
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid request data" });
    }
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid ID format" });
    }
    return next(err);
  }
};

// POST /signin - user login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(BAD_REQUEST).json({ message: "Invalid request data" });
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'super-strong-secret', {
      expiresIn: "7d",
    });

    return res.json({ token });
  } catch (err) {
    if (err.status === UNAUTHORIZED) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Incorrect email or password" });
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
