const express = require("express");
const clothingItemsRoutes = require("./clothingItems");
const usersRoutes = require("./users");
const { createUser, login } = require("../controllers/users");
const { validateSignup, validateSignin } = require("../middlewares/validation");

const router = express.Router();

router.post("/signin", validateSignin, login);
router.post("/signup", validateSignup, createUser);

// Use the routes
router.use("/items", clothingItemsRoutes);
router.use("/users", usersRoutes);

module.exports = router;
