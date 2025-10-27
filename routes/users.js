const express = require("express");
const router = express.Router();

const { getUsers, getUser, createUser } = require("../controllers/users");

// Get all users
router.get("/", getUsers);

// Get user by ID
router.get("/:userId", getUser);

// Create a new user
router.post("/", createUser);

module.exports = router;
