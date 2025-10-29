const express = require("express");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Sample data
const sampleItems = [
  {
    _id: "1",
    name: "T-Shirt",
    weather: "warm",
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/T-Shirt.png?etag=44ed1963c44ab19cd2f5011522c5fc09",
    owner: "5d8b8592978f8bd833ca8133",
    likes: [],
    createdAt: new Date(),
  },
  {
    _id: "2",
    name: "Shorts",
    weather: "warm",
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Shorts.png?etag=58345e8bef1ce5f95ac882e71d309e6c",
    owner: "5d8b8592978f8bd833ca8133",
    likes: [],
    createdAt: new Date(),
  },
  {
    _id: "3",
    name: "Sneakers",
    weather: "warm",
    imageUrl:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Sneakers.png?etag=3efeec41c1c78b8afe26859ca7fa7b6f",
    owner: "5d8b8592978f8bd833ca8133",
    likes: [],
    createdAt: new Date(),
  },
];

const sampleUsers = [
  {
    _id: "5d8b8592978f8bd833ca8133",
    name: "Test User",
    avatar: "https://example.com/avatar.jpg",
  },
];

// Items endpoints
app.get("/items", (req, res) => {
  res.json(sampleItems);
});

app.post("/items", (req, res) => {
  const { name, weather, imageUrl } = req.body;
  if (!name || !weather || !imageUrl) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const newItem = {
    _id: Date.now().toString(),
    name,
    weather,
    imageUrl,
    owner: "5d8b8592978f8bd833ca8133",
    likes: [],
    createdAt: new Date(),
  };
  sampleItems.push(newItem);
  res.status(201).json(newItem);
});

app.delete("/items/:itemId", (req, res) => {
  const { itemId } = req.params;
  const index = sampleItems.findIndex((item) => item._id === itemId);
  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }
  sampleItems.splice(index, 1);
  res.json({ message: "Item deleted successfully" });
});

app.put("/items/:itemId/likes", (req, res) => {
  const { itemId } = req.params;
  const item = sampleItems.find((item) => item._id === itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  if (!item.likes.includes("5d8b8592978f8bd833ca8133")) {
    item.likes.push("5d8b8592978f8bd833ca8133");
  }
  res.json(item);
});

app.delete("/items/:itemId/likes", (req, res) => {
  const { itemId } = req.params;
  const item = sampleItems.find((item) => item._id === itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  item.likes = item.likes.filter((id) => id !== "5d8b8592978f8bd833ca8133");
  res.json(item);
});

// Users endpoints
app.get("/users", (req, res) => {
  res.json(sampleUsers);
});

app.get("/users/:userId", (req, res) => {
  const { userId } = req.params;
  const user = sampleUsers.find((u) => u._id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

app.post("/users", (req, res) => {
  const { name, avatar } = req.body;
  if (!name || !avatar) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (name.length < 2) {
    return res
      .status(400)
      .json({ message: "Name must be at least 2 characters" });
  }
  if (name.length > 30) {
    return res
      .status(400)
      .json({ message: "Name must be no more than 30 characters" });
  }
  const newUser = {
    _id: Date.now().toString(),
    name,
    avatar,
  };
  sampleUsers.push(newUser);
  res.status(201).json(newUser);
});

// Start server
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
