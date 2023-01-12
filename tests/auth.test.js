const request = require("supertest");
const app = require("../index");
const User = require("../models/user");

describe("Auth route", () => {
  // Create mock data needed for tests
  const body = {
    email: "greatestEmailEv1@email.com",
    password: "testPassword",
  };
  const badBodyData = [
    { email: "testemail@email.com" }, // missing password key/value
    { password: "testpassword" }, // missing email key/value
    {}, // missing both email & password key/value
  ];

  beforeEach(async () => {
    // before each test make sure our mock user doesn't exist.
    // this will ensure every test has a fresh start
    // and doesn't rely on stale data
    const userToDelete = await User.findUserByEmail(body.email);
    if (userToDelete) {
      await User.deleteUserById(userToDelete.id);
    }
  });

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
    });

    describe("when the user already exists", () => {
      it("should return HTTP 409 with error message in body", async () => {
        // vvvvvvvvv error created from user model vvvvvvvvvvvvv
        // throw createError(409, `User with email: ${email} already exists!`);
        let response = await request(app).post("/auth/register").send(body);
        id = response.body.id;

        // run again as to replicate "duplicating" user
        // store in response so we can test against it
        response = await request(app).post("/auth/register").send(body);
        expect(response.statusCode).toBe(409);
        expect(typeof response.body).toBe("object");
        expect(response.body).toHaveProperty(
          "message",
          `User with email: ${body.email} already exists!`
        );
      });
    });

    describe("when email or password info is missing", () => {
      it("should return HTTP 400 with error message", async () => {
        for (const body of badBodyData) {
          const response = await request(app).post("/auth/register").send(body);
          expect(response.statusCode).toBe(400);
          expect(typeof response.body).toBe("object");
          expect(response.body).toHaveProperty(
            "message",
            "Missing email or password information!"
          );
        }
      });
    });
  });

  describe("POST /login", () => {
    describe("when the username doesn't exist in the database", () => {
      //throw createError(401, "Incorrect username or password");
      it("should return HTTP 401", async () => {
        const response = await request(app).post("/auth/login").send(body);
        expect(response.statusCode).toBe(401);
      });
    });
    describe("when the password doesn't match in the database", () => {
      it("should return HTTP 401", async () => {
        // first register the user
        let response = await request(app).post("/auth/register").send(body);
        id = response.body.id;
        response = await request(app)
          .post("/auth/login")
          .send({ email: body.email, password: "badpassword" });
        expect(response.statusCode).toBe(401);
      });
    });
    // TODO
    describe("when there is no info sent at all", () => {});
  });
});
