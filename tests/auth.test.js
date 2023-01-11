const request = require("supertest");
const app = require("../index");
const deleteUser = require("../models/user").deleteUser;

const user = {
  email: "testEmail292@email.com",
  password: "testPassword",
};

let id;
afterAll(async () => {
  await deleteUser(id);
});

describe("/auth route", () => {
  describe("POST /register", () => {
    describe("given a username and password", () => {
      it("should return a new user", async () => {
        const response = await request(app).post("/auth/register").send(user);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("password");
        expect(response.body).toHaveProperty("email", user.email);
        expect(response.body).toHaveProperty("id");
        id = response.body.id; // referenced in afterAll for cleanup of database
        expect(response.body).toHaveProperty("cart_id");
      });
    });

    describe("when the user already exists", () => {
      it("should return HTTP 409 with error message in body", async () => {
        // use the user we already registered above
        // vvvvvvvvv error created from user model vvvvvvvvvvvvv
        // throw createError(409, `User with email: ${email} already exists!`);
        const response = await request(app).post("/auth/register").send(user);
        expect(response.statusCode).toBe(409);
        expect(response.body).toHaveProperty(
          "message",
          `User with email: ${user.email} already exists!`
        );
      });
    });

    describe("when email or password info is missing", () => {
      it("should return HTTP 400 with error message in body", async () => {
        const bodyData = [
          { email: "testemail@email.com" }, // missing password key/value
          { password: "testpassword" }, // missing email key/value
          {}, // missing both email & password key/value
        ];

        for (const body of bodyData) {
          const response = await request(app).post("/auth/register").send(body);
          expect(response.statusCode).toBe(400);
          expect(response.body).toHaveProperty(
            "message",
            "Missing email or password information!"
          );
        }
      });
    });
  });
});
