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

// Public routes
router.post("/", createUser);
router.get("/:userId", getUserById);

// Protected routes
router.use(auth);
router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.patch("/me", updateCurrentUser);

module.exports = router;
