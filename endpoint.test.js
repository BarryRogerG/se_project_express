const supertest = require("supertest");
const app = require("./app.js");
const request = supertest(app);

describe("Endpoints respond to requests", () => {
  it('Returns data and status 200 on request to "/"', () => {
    return request.get("/").then((response) => {
      expect(response.status).toBe(200);
      expect(response.text).toBe("Hello, world!");
    });
  });
});

describe("POST /items", () => {
  it("creates an item when data is valid", async () => {
    const newItem = { name: "Boots", weather: "cold" };
    const res = await request.post("/items").send(newItem);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(newItem);
  });
});
