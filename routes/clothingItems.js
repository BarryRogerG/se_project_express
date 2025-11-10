const express = require("express");
const auth = require("../middlewares/auth");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

const router = express.Router();

// GET /items - get all clothing items
router.get("/", getClothingItems);

// POST /items - create a new clothing item
router.post("/", auth, createClothingItem);

// DELETE /items/:itemId - delete a clothing item
router.delete("/:itemId", auth, deleteClothingItem);

// PUT /items/:itemId/likes - like a clothing item
router.put("/:itemId/likes", auth, likeItem);

// DELETE /items/:itemId/likes - unlike a clothing item
router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;