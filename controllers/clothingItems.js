const ClothingItem = require("../models/clothingItem");

// GET /items - get all clothing items
const getClothingItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find({});
    return res.json(items);
  } catch (err) {
    return next(err);
  }
};

// GET /items/:itemId - get a single clothing item
const getClothingItemById = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findById(itemId).orFail();
    return res.json(item);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return res.status(404).json({ message: "Item not found" });
    }
    return next(err);
  }
};

// POST /items - create a new clothing item
const createClothingItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;
    
    const newItem = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).json(newItem);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return next(err);
  }
};

// DELETE /items/:itemId - delete a clothing item
const deleteClothingItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    await ClothingItem.findByIdAndDelete(itemId).orFail();
    return res.json({ message: "Item deleted successfully" });
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return res.status(404).json({ message: "Item not found" });
    }
    return next(err);
  }
};

// PUT /items/:itemId/likes - like a clothing item
const likeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail();
    
    return res.json(item);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return res.status(404).json({ message: "Item not found" });
    }
    return next(err);
  }
};

// DELETE /items/:itemId/likes - unlike a clothing item
const unlikeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail();
    
    return res.json(item);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return res.status(404).json({ message: "Item not found" });
    }
    return next(err);
  }
};

module.exports = {
  getClothingItems,
  getClothingItemById,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
};
