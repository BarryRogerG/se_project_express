const express = require("express");
const router = express.Router();

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

// Get all clothing items
router.get("/", getClothingItems);

// Create a new clothing item
router.post("/", createClothingItem);

// Delete a clothing item
router.delete("/:itemId", deleteClothingItem);

module.exports = router;
