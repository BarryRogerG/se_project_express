const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

const CREATED = 201;

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
      return next(new ForbiddenError("Forbidden"));
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
      return next(new BadRequestError("Invalid request data"));
    }
    return next(err);
  }
};

// DELETE /items/:id - delete a clothing item
const deleteClothingItem = async (req, res, next) => {
  try {
    const { id: itemId } = req.params;
    // Validation middleware handles itemId format validation

    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return next(new NotFoundError("Item not found"));
    }

    const userId = req.user && req.user._id;
    if (!userId || item.owner.toString() !== userId) {
      return next(new ForbiddenError("Forbidden"));
    }

    await item.deleteOne();
    return res.json({ message: "Item deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid ID format"));
    }
    return next(err);
  }
};

// PUT /items/:id/likes - like a clothing item
const likeItem = async (req, res, next) => {
  try {
    const { id: itemId } = req.params;
    // Validation middleware handles itemId format validation

    const userId = req.user && req.user._id;
    if (!userId) {
      return next(new ForbiddenError("Forbidden"));
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!item) {
      return next(new NotFoundError("Item not found"));
    }

    return res.json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid ID format"));
    }
    return next(err);
  }
};

// DELETE /items/:id/likes - unlike a clothing item
const unlikeItem = async (req, res, next) => {
  try {
    const { id: itemId } = req.params;
    // Validation middleware handles itemId format validation

    const userId = req.user && req.user._id;
    if (!userId) {
      return next(new ForbiddenError("Forbidden"));
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!item) {
      return next(new NotFoundError("Item not found"));
    }

    return res.json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid ID format"));
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
