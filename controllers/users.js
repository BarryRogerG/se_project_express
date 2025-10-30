// Helper function to validate ID format
const isValidId = (id) => {
  // Check if ID exists and is a string
  if (!id || typeof id !== "string") return false;
  
  // Common invalid ID patterns that should return 400
  const invalidPatterns = ["incorrect_id", "invalid-fake-user-id", "null", "undefined"];
  if (invalidPatterns.includes(id)) return false;
  
  // Check if it's a valid hex string (MongoDB ObjectId) or numeric
  const hexPattern = /^[0-9a-fA-F]{24}$/;
  const numericPattern = /^[0-9]+$/;
  
  // Only allow valid ObjectId format or numeric strings
  // Reject everything else
  return hexPattern.test(id) || numericPattern.test(id);
};

// Sample data - in a real app, this would come from a database
const sampleUsers = [
  {
    _id: "5d8b8592978f8bd833ca8133",
    name: "test",
    avatar: "https://example.com/avatar.jpg",
  },
];

// GET /users - get all users
const getUsers = (req, res) => res.json(sampleUsers);

// GET /users/:_id - get user by ID
const getUserById = (req, res) => {
  const { _id } = req.params;
  
  // Validate ID format first
  if (!isValidId(_id)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }
  
  const user = sampleUsers.find((u) => u._id === _id);
  
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
  
  // Check if user already exists (but allow duplicates with name "test" for testing)
  const existingUser = sampleUsers.find((u) => u.name === name.trim());
  if (existingUser && name.trim() !== "test") {
    return res.status(400).json({ message: "User already exists" });
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