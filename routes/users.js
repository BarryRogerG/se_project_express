const express = require("express");
const { getUsers, getUserById, createUser } = require("../controllers/users");

const router = express.Router();

// GET /users - get all users
router.get("/", getUsers);

// GET /users/:_id - get user by ID
router.get("/:_id", getUserById);

// POST /users - create a new user
router.post("/", createUser);

module.exports = router;