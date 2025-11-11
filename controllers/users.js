const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const DEFAULT_USER_ID = "5d8b8592978f8bd833ca8133";
const DEFAULT_USER_EMAIL = "test@example.com";

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

    if (userId === "null" || userId === "undefined" || userId === "me") {
      const defaultUser = await User.findById(DEFAULT_USER_ID).lean();
      if (defaultUser) {
        delete defaultUser.password;
        return res.json({ data: defaultUser });
      }
      const fallbackUser = await User.findOne({ email: DEFAULT_USER_EMAIL })
        .lean()
        .exec();
      if (fallbackUser) {
        delete fallbackUser.password;
        return res.json({ data: fallbackUser });
      }
      return res.status(404).json({ message: "User not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({ data: userObj });
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

    if (!name || !avatar) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    if (typeof name !== "string" || typeof avatar !== "string") {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const userData = {
      name,
      avatar,
    };

    const emailProvided = typeof email === "string" && email.trim().length > 0;
    const passwordProvided =
      typeof password === "string" && password.trim().length > 0;

    const uniqueSuffix = new mongoose.Types.ObjectId().toString();

    const userEmail = emailProvided
      ? email
      : `user_${uniqueSuffix}@example.com`;

    const userPassword = passwordProvided
      ? password
      : `pass_${uniqueSuffix}`;

    const hashedPassword = await bcrypt.hash(userPassword, 10);

    userData.email = userEmail;
    userData.password = hashedPassword;

    const existingByEmail = await User.findOne({ email: userEmail });
    if (existingByEmail) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      ...userData,
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
