// Error handling middleware
const handleError = (err, req, res, _next) => {
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
  } else if (err.name === "DocumentNotFoundError") {
    status = 404;
    message = "Not found";
  } else if (err.status) {
    status = err.status;
    message = err.message;
  }
  
  return res.status(status).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 404 handler
const handleNotFound = (req, res) => res.status(404).json({ message: "Route not found" });

module.exports = {
  handleError,
  handleNotFound,
};