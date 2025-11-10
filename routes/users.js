const express = require("express");
const auth = require("../middlewares/auth");
const {
  getUsers,
  getCurrentUser,
  getUserById,
  createUser,
  updateCurrentUser,
} = require("../controllers/users");

const router = express.Router();

// POST /users - create a new user
router.post("/", createUser);

router.use(auth);

// GET /users - get all users
router.get("/", getUsers);

// GET /users/me - get current user
router.get("/me", getCurrentUser);

// GET /users/:userId - get user by ID
router.get("/:userId", getUserById);

// PATCH /users/me - update profile
router.patch("/me", updateCurrentUser);

module.exports = router;
