// Sample data - in a real app, this would come from a database
const sampleUsers = [
  {
    _id: "5d8b8592978f8bd833ca8133",
    name: "Test User",
    avatar: "https://example.com/avatar.jpg",
  },
];

// GET /users - get all users
const getUsers = (req, res) => {
  return res.json(sampleUsers);
};

// GET /users/:userId - get user by ID
const getUserById = (req, res) => {
  const { userId } = req.params;
  const user = sampleUsers.find((u) => u._id === userId);
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  return res.json(user);
};

// POST /users - create a new user
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  
  // Validation
  if (!name || !avatar) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  if (typeof name !== "string" || typeof avatar !== "string") {
    return res.status(400).json({ message: "Invalid field types" });
  }
  
  if (name.trim().length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters" });
  }
  
  if (name.trim().length > 30) {
    return res.status(400).json({ message: "Name must be no more than 30 characters" });
  }
  
  // Check if user already exists
  const existingUser = sampleUsers.find((u) => u.name === name.trim());
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }
  
  const newUser = {
    _id: Date.now().toString(),
    name: name.trim(),
    avatar,
  };
  
  sampleUsers.push(newUser);
  return res.status(201).json(newUser);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};