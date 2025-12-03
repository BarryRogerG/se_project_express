const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("./app.js");
const User = require("./models/user");

const request = supertest(app);
const MONGO_URL = "mongodb://127.0.0.1:27017/wtwr_db_test";

// Connect to database before all tests
beforeAll(() => {
  return mongoose.connect(MONGO_URL);
});

// Disconnect from database after all tests
afterAll(() => {
  return mongoose.disconnect();
});

describe("Endpoints respond to requests", () => {
  // Clean up test users after each test
  afterEach(async () => {
    await User.deleteMany({ email: /^test.*@example\.com$/ });
  });

  it('POST request to "/users" returns JSON with user data and status 201', () => {
    const userData = {
      name: "Test User",
      avatar: "https://example.com/avatar.jpg",
      email: `test${Date.now()}@example.com`,
      password: "TestPassword123!",
    };

    return request
      .post("/users")
      .send(userData)
      .then((response) => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("name", userData.name);
        expect(response.body).toHaveProperty("avatar", userData.avatar);
        expect(response.body).toHaveProperty("email", userData.email);
        expect(response.body).not.toHaveProperty("password");
      });
  });
});
