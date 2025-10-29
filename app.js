const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { handleError, handleNotFound } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

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

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`App listening at port ${PORT}`);
});
