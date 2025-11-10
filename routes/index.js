const express = require("express");
const clothingItemsRoutes = require("./clothingItems");
const usersRoutes = require("./users");
const { createUser, login } = require("../controllers/users");

const router = express.Router();

router.post("/signin", login);
router.post("/signup", createUser);

// Use the routes
router.use("/items", clothingItemsRoutes);
router.use("/users", usersRoutes);

module.exports = router;
