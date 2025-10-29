const express = require("express");
const clothingItemsRoutes = require("./clothingItems");
const usersRoutes = require("./users");

const router = express.Router();

// Use the routes
router.use("/items", clothingItemsRoutes);
router.use("/users", usersRoutes);

module.exports = router;
