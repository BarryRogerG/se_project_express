const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
const { handleError, handleNotFound } = require("./utils/errors");

const app = express();
const { PORT = 3001, MONGODB_URI = "mongodb://localhost:27017/wtwr_db" } = process.env;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Use routes
app.use("/", routes);

// 404 handler
app.use(handleNotFound);

// Error handling middleware
app.use(handleError);

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // MongoDB connected successfully
    app.listen(PORT, "0.0.0.0", () => {
      // Server started successfully
    });
  })
  .catch((err) => {
    // MongoDB connection failed
    console.error("Error connecting to MongoDB:", err);
  });
