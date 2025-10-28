const express = require("express");
const router = express.Router();

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");

// Get all clothing items
router.get("/", getClothingItems);

// Create a new clothing item
router.post("/", createClothingItem);

// Like a clothing item
router.put("/:itemId/likes", likeClothingItem);

// Unlike a clothing item
router.delete("/:itemId/likes", unlikeClothingItem);

// Delete a clothing item
router.delete("/:itemId", deleteClothingItem);

module.exports = router;
