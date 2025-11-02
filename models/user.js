const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        try {
          const url = new URL(v);
          if (!["http:", "https:"].includes(url.protocol)) return false;
          if (!url.hostname || !url.hostname.includes(".")) return false;
          return true;
        } catch (e) {
          return false;
        }
      },
      message: "Invalid avatar URL format",
    },
  },
});

module.exports = mongoose.model("User", userSchema);
