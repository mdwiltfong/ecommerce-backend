const request = require("supertest");
const app = require("../index");

describe("Products route", () => {
  let response;
  let productId;
  const productObject = expect.objectContaining({
    id: expect.any(Number),
    name: expect.any(String),
    price: expect.any(String),
    description: expect.any(String),
    category: expect.any(String),
  });
  let arrayOfProducts = expect.arrayContaining([productObject]);
  const emptyObject = expect.objectContaining({});

  describe("GET /products", () => {
    beforeAll(async () => {
      response = await request(app).get("/products");
      // set a productId variable for later testing
      productId = response.body[0].id;
    });

    it("should return HTTP 200", async () => {
      expect(response.statusCode).toBe(200);
    });

    it("should return an array of products", () => {
      expect(response.body).toEqual(arrayOfProducts);
    });
  });

  describe("GET /products?category=fishing", () => {
    const arrayOfFishingProducts = expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        price: expect.any(String),
        description: expect.any(String),
        category: "Fishing",
      }),
    ]);
    beforeAll(async () => {
      response = await request(app).get("/products?category=fishing");
    });
    it("should return HTTP 200", () => {
      expect(response.statusCode).toBe(200);
    });

    it("should return an array of products within the fishing category", () => {
      expect(response.body).toEqual(arrayOfFishingProducts);
    });
  });

  describe("GET /products?name=test", () => {
    beforeAll(async () => {
      response = await request(app).get("/products?name=test");
    });

    it("should return HTTP 200", () => {
      expect(response.statusCode).toBe(200);
    });

    it("should return products that match the parameter search", () => {
      expect(response.body).toEqual(arrayOfProducts);
    });
  });

  describe("GET /products/:id", () => {
    beforeAll(async () => {
      response = await request(app).get(`/products/${productId}`);
    });

    it("should return HTTP 200", () => {
      expect(response.statusCode).toBe(200);
    });

    it("should return a single product object", () => {
      expect(response.body).toEqual(productObject);
    });
  });

  describe("PUT /products/:id", () => {
    beforeAll(async () => {
      response = await request(app).put(`/products/${productId}`).send({
        name: "Great product name",
        price: 350.0,
        description: "What a great description",
        category: "Fishing",
      });
    });
    it("should return HTTP 200", () => {
      expect(response.statusCode).toBe(200);
    });

    it("should return the updated products object", () => {
      expect(response.body).toEqual(productObject);
    });
  });

  describe("DELETE /products/:id", () => {
    beforeAll(async () => {
      response = await request(app).delete(`/products/${productId}`);
    });

    it("should return HTTP 204", () => {
      expect(response.statusCode).toBe(204);
    });

    it("should return nothing in the body", () => {
      expect(response.body).toEqual(emptyObject);
    });
  });
});
