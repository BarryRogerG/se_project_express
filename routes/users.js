const express = require("express");
const auth = require("../middlewares/auth");
const {
  getUsers,
  getCurrentUser,
  createUser,
  updateCurrentUser,
} = require("../controllers/users");
const { validateUpdateUser } = require("../middlewares/validation");

const router = express.Router();

// Public routes
router.post("/", createUser);

// Protected routes
router.use(auth);
router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateUser, updateCurrentUser);

module.exports = router;
