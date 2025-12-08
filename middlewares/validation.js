const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

// Custom URL validation
const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// Validation schemas
const validateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be no more than 30 characters long",
      "any.required": "Name is required",
    }),
    avatar: Joi.string().required().custom(validateUrl).messages({
      "any.required": "Avatar URL is required",
      "string.uri": "Avatar must be a valid URL",
    }),
    email: Joi.string().required().email().messages({
      "any.required": "Email is required",
      "string.email": "Email must be a valid email address",
    }),
    password: Joi.string().min(8).required().messages({
      "string.min": "Password must be at least 8 characters long",
      "any.required": "Password is required",
    }),
  }),
});

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "any.required": "Email is required",
      "string.email": "Email must be a valid email address",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be no more than 30 characters long",
    }),
    avatar: Joi.string().custom(validateUrl).messages({
      "string.uri": "Avatar must be a valid URL",
    }),
  }),
});

const validateCreateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be no more than 30 characters long",
      "any.required": "Name is required",
    }),
    weather: Joi.string()
      .valid("hot", "warm", "cold")
      .required()
      .messages({
        "any.only": "Weather must be one of: hot, warm, cold",
        "any.required": "Weather is required",
      }),
    imageUrl: Joi.string().required().custom(validateUrl).messages({
      "any.required": "Image URL is required",
      "string.uri": "Image URL must be a valid URL",
    }),
  }),
});

const validateItemId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.hex": "Item ID must be a valid MongoDB ObjectId",
      "string.length": "Item ID must be 24 characters long",
      "any.required": "Item ID is required",
    }),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateUpdateUser,
  validateCreateItem,
  validateItemId,
};

