require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
const { handleNotFound } = require("./utils/errors");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const { PORT = 3001, MONGODB_URI = "mongodb://localhost:27017/wtwr_db" } =
  process.env;

app.use(cors());
app.use(express.json());

// Request logging (before routes)
app.use(requestLogger);

// Crash test route for PM2 testing (remove after code review)
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use("/", routes);

// Error logging (before error handler)
app.use(errorLogger);

// 404 handler and error handler (must be last)
app.use(handleNotFound);
app.use(errorHandler);

const startServer = () => {
  if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`App listening at port ${PORT}`);
    });
  }
};

// Only connect to MongoDB if not running tests
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("Connected to MongoDB");
      startServer();
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error("Failed to connect to MongoDB", err);
      startServer();
    });
}

module.exports = app;
