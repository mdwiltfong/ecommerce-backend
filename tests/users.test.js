const request = require("supertest");
const app = require("../index");

describe("Users route", () => {
  const body = {
    email: "testEmail@email.com",
    password: "testPassword",
  };
  let response;
  let userId;
  const userObject = {
    id: expect.any(Number),
    cart_id: null,
    email: expect.any(String),
    password: expect.any(String),
  };

  beforeAll(async () => {
    // register a user before running tests
    await request(app).post("/auth/register").send(body);
    // get users list
    response = await request(app).get("/users");
    userId = response.body[0].id;
  });

  describe("GET /users", () => {
    it("should return HTTP 200", () => {
      expect(response.statusCode).toBe(200);
    });

    it("should list all users in json", async () => {
      expect(response.body).toEqual(
        expect.arrayContaining([expect.objectContaining(userObject)])
      );
    });
  });

  describe("GET /users/:id", () => {
    describe("given a registered users id", () => {
      beforeAll(async () => {
        response = await request(app).get("/users");
        const url = `/users/${userId}`;
        response = await request(app).get(url);
      });

      it("should return HTTP 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should return a user object", () => {
        expect(response.body).toEqual(expect.objectContaining(userObject));
      });
    });

    describe("given an id that doesnt exist", () => {
      beforeAll(async () => {
        response = await request(app).get("/users/99999999");
      });
      it("should return HTTP 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should not return a user object", () => {
        expect(response.body).toEqual(expect.not.objectContaining(userObject));
      });
    });
  });

  describe("PUT /users/:id", () => {
    let newPassword = "thisIsANewPassword";
    beforeAll(async () => {
      response = await request(app).put(`/users/${userId}`).send({
        password: newPassword,
      });
    });

    describe("given a valid user id", () => {
      it("should return HTTP 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should return a user object", () => {
        expect(response.body).toEqual(expect.objectContaining(userObject));
      });
    });

    describe("given an invalid id", () => {
      beforeAll(async () => {
        response = await request(app).put("/users/9999999").send({
          password: newPassword,
        });
      });

      it("should return HTTP 400", () => {
        expect(response.statusCode).toBe(400);
      });

      it("should return an object with property message", () => {
        expect(response.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
          })
        );
      });
    });
  });
});
