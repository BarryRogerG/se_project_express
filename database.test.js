const mongoose = require("mongoose");
const User = require("./models/user");

const MONGO_URL = "mongodb://127.0.0.1:27017/wtwr_db_test";

// Test data fixture
const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "TestPassword123!",
  avatar: "https://example.com/avatar.jpg",
};

// Connect to database before all tests
beforeAll(() => {
  return mongoose.connect(MONGO_URL);
});

// Disconnect from database after all tests
afterAll(() => {
  return mongoose.disconnect();
});

describe("Database tests", () => {
  // Add test data before each test
  beforeEach(() => {
    return User.create(testUser);
  });

  // Delete test data after each test
  afterEach(() => {
    return User.deleteOne({ email: testUser.email });
  });

  // Test that the user was created correctly
  test("The user must be complete", () => {
    return User.findOne({ email: testUser.email }).then((user) => {
      expect(user).toBeDefined();
      expect(user.email).toBe(testUser.email);
      expect(user.name).toBe(testUser.name);
    });
  });
});
