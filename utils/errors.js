const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require("./constants");

// Error handling middleware
const handleError = (err, req, res, _next) => {
  // Default error
  let status = INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  
  // Handle specific error types
  if (err.name === "ValidationError") {
    status = BAD_REQUEST;
    message = "Validation error";
  } else if (err.name === "CastError") {
    status = BAD_REQUEST;
    message = "Invalid ID format";
  } else if (err.name === "DocumentNotFoundError") {
    status = NOT_FOUND;
    message = "Not found";
  } else if (err.status) {
    status = err.status;
    message = err.message;
  }
  
  return res.status(status).json({
    message,
  });
};

// 404 handler
const handleNotFound = (req, res) => res.status(NOT_FOUND).json({ message: "Route not found" });

module.exports = {
  handleError,
  handleNotFound,
};