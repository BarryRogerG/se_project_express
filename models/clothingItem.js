const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      trim: true,
    },
    weather: {
      type: String,
      required: true,
      enum: ["hot", "warm", "cold"],
    },
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: validator.isURL,
        message: "Image URL must be valid",
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: true,
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("ClothingItem", clothingItemSchema);
