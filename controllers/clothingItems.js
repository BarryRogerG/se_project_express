const ClothingItem = require("../models/clothingItem");
const { ERROR_CODE } = require("../utils/errors");

// Get all clothing items
const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .populate("owner")
    .populate("likes")
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// Create a new clothing item
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id; // Get user ID from middleware

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({ message: "Invalid data" });
      }
      res
        .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// Delete a clothing item
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = ERROR_CODE.NOT_FOUND;
      throw error;
    })
    .then((item) => {
      res.send({ message: "Item deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE.BAD_REQUEST)
          .send({ message: "Invalid item ID" });
      }
      if (err.statusCode === ERROR_CODE.NOT_FOUND) {
        return res
          .status(ERROR_CODE.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      res
        .status(ERROR_CODE.INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
};
