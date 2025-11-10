// Sample data - in a real app, this would come from a database
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

// GET /items - get all clothing items
const getClothingItems = (req, res) => res.json(sampleItems);

// POST /items - create a new clothing item
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  // Validation
  if (!name || !weather || !imageUrl) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (
    typeof name !== "string" ||
    typeof weather !== "string" ||
    typeof imageUrl !== "string"
  ) {
    return res.status(400).json({ message: "Invalid field types" });
  }

  if (name.trim().length < 2) {
    return res
      .status(400)
      .json({ message: "Name must be at least 2 characters" });
  }

  if (name.trim().length > 30) {
    return res
      .status(400)
      .json({ message: "Name must be no more than 30 characters" });
  }

  const validWeatherTypes = ["hot", "warm", "cold"];
  if (!validWeatherTypes.includes(weather)) {
    return res.status(400).json({ message: "Invalid weather type" });
  }

  const newItem = {
    _id: Date.now().toString(),
    name: name.trim(),
    weather,
    imageUrl,
    owner: "5d8b8592978f8bd833ca8133",
    likes: [],
    createdAt: new Date(),
  };

  sampleItems.push(newItem);
  return res.status(201).json(newItem);
};

// DELETE /items/:itemId - delete a clothing item
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  const index = sampleItems.findIndex((item) => item._id === itemId);

  if (index === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  const item = sampleItems[index];
  const userId = req.user && req.user._id;

  if (!userId || item.owner !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  sampleItems.splice(index, 1);
  return res.json({ message: "Item deleted successfully" });
};

// PUT /items/:itemId/likes - like a clothing item
const likeItem = (req, res) => {
  const { itemId } = req.params;
  const foundItem = sampleItems.find((item) => item._id === itemId);

  if (!foundItem) {
    return res.status(404).json({ message: "Item not found" });
  }

  const userId = "5d8b8592978f8bd833ca8133";
  if (!foundItem.likes.includes(userId)) {
    foundItem.likes.push(userId);
  }

  return res.json(foundItem);
};

// DELETE /items/:itemId/likes - unlike a clothing item
const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const foundItem = sampleItems.find((item) => item._id === itemId);

  if (!foundItem) {
    return res.status(404).json({ message: "Item not found" });
  }

  const userId = "5d8b8592978f8bd833ca8133";
  foundItem.likes = foundItem.likes.filter((id) => id !== userId);

  return res.json(foundItem);
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
};
