// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error(err);

  // Default error
  let status = 500;
  let message = "Internal Server Error";

  // Handle specific error types
  if (err.name === "ValidationError") {
    status = 400;
    message = err.message;
  } else if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID format";
  } else if (
    err.name === "BadRequestError" ||
    err.name === "UnauthorizedError" ||
    err.name === "ForbiddenError" ||
    err.name === "NotFoundError" ||
    err.name === "ConflictError"
  ) {
    // Handle custom error constructors
    status = err.status;
    message = err.message;
  } else if (err.status) {
    // Handle errors with status property
    status = err.status;
    message = err.message;
  }

  // Send response with correct status code and message
  return res.status(status).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;

