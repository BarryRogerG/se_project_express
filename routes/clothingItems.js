const express = require("express");
const {
  getClothingItems,
  getClothingItemById,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

const router = express.Router();

// GET /items - get all clothing items
router.get("/", getClothingItems);

// POST /items - create a new clothing item
router.post("/", createClothingItem);

// DELETE /items/:itemId - delete a clothing item
router.delete("/:itemId", deleteClothingItem);

// PUT /items/:itemId/likes - like a clothing item
router.put("/:itemId/likes", likeItem);

// DELETE /items/:itemId/likes - unlike a clothing item
router.delete("/:itemId/likes", unlikeItem);

// GET /items/:itemId - get a single clothing item
router.get("/:itemId", getClothingItemById);

module.exports = router;