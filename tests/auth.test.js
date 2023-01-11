const request = require("supertest");
const app = require("../index");
const deleteUser = require("../models/user").deleteUser;

describe("Auth route", () => {
  // Create mock data needed for tests
  const body = {
    email: "greatestEmailEver11111@email.com",
    password: "testPassword",
  };
  const badBodyData = [
    { email: "testemail@email.com" }, // missing password key/value
    { password: "testpassword" }, // missing email key/value
    {}, // missing both email & password key/value
  ];
  let id; // cleanup user... deleteUser(id)
  describe("POST /register", () => {
    describe("given a username and password in the body", () => {
      it("should return HTTP 200 with user information from the database", async () => {
        const response = await request(app).post("/auth/register").send(body);
        expect(response.statusCode).toBe(200);
        expect(typeof response.body).toBe("object");
        expect(response.body).toHaveProperty("password");
        expect(response.body).toHaveProperty("email", body.email);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("cart_id");
        id = response.body.id;
      });
      afterEach(async () => {
        await deleteUser(id);
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
