const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CREATED = 201;

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /items - get all clothing items
const getClothingItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find({});
    return res.json(items);
  } catch (err) {
    return next(err);
  }
};

// POST /items - create a new clothing item
const createClothingItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user && req.user._id ? req.user._id : undefined;

    if (!owner) {
      return res.status(FORBIDDEN).json({ message: "Forbidden" });
    }

    const item = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner,
    });

    return res.status(CREATED).json(item);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid request data" });
    }
    return next(err);
  }
};

// DELETE /items/:itemId - delete a clothing item
const deleteClothingItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!isValidObjectId(itemId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid ID format" });
    }

    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }

    const userId = req.user && req.user._id;
    if (!userId || item.owner.toString() !== userId) {
      return res.status(FORBIDDEN).json({ message: "Forbidden" });
    }

    await item.deleteOne();
    return res.json({ message: "Item deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid ID format" });
    }
    return next(err);
  }
};

// PUT /items/:itemId/likes - like a clothing item
const likeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!isValidObjectId(itemId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid ID format" });
    }

    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(FORBIDDEN).json({ message: "Forbidden" });
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }

    return res.json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid ID format" });
    }
    return next(err);
  }
};

// DELETE /items/:itemId/likes - unlike a clothing item
const unlikeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!isValidObjectId(itemId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid ID format" });
    }

    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(FORBIDDEN).json({ message: "Forbidden" });
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }

    return res.json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid ID format" });
    }
    return next(err);
  }
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
};
