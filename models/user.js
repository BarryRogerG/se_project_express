const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator: (v) => urlRegex.test(v),
        message: "Avatar must be a valid URL",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Email must be valid",
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        const error = new Error("Incorrect email or password");
        error.status = 401;
        throw error;
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const error = new Error("Incorrect email or password");
          error.status = 401;
          throw error;
        }
        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);
