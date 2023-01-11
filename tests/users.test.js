const request = require("supertest");
const app = require("../index");

describe("Users route", () => {
  describe("GET /users", () => {
    it("should list all users in json", async () => {
      const response = await request(app).get("/users");
      expect(response.ok).toBe(true);
    });
  });
});
