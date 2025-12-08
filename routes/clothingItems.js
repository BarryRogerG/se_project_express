const express = require("express");
const auth = require("../middlewares/auth");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const { validateCreateItem, validateItemId } = require("../middlewares/validation");

const router = express.Router();

// GET /items - get all clothing items
router.get("/", getClothingItems);

// POST /items - create a new clothing item
router.post("/", auth, validateCreateItem, createClothingItem);

// DELETE /items/:id - delete a clothing item
router.delete("/:id", auth, validateItemId, deleteClothingItem);

// PUT /items/:id/likes - like a clothing item
router.put("/:id/likes", auth, validateItemId, likeItem);

// DELETE /items/:id/likes - unlike a clothing item
router.delete("/:id/likes", auth, validateItemId, unlikeItem);

module.exports = router;