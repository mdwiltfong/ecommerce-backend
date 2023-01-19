const request = require("supertest");
const app = require("../index");

describe("Products route", () => {
  // variable setup needed to test product route
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
  const emptyArray = expect.arrayContaining([]);
  const urls = {
    good: [
      "/products?category=fishing",
      "/products?category=electronics",
      "/products?name=test",
      "/products?name=fishing",
    ],
    bad: [
      "/products?category=wgwergrwgrgreg",
      "/products?name=rgkjergiergreger",
      "/products?name=3230222g2",
      "/products?name=_________123",
    ],
  };

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

  describe("GET /products?query=something", () => {
    // two queries could be possible, name and category
    // see urls object above to see possible queries
    describe("given a query that matches something in the database", () => {
      it("should ", async () => {
        for (const url of urls.good) {
          response = await request(app).get(url);
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual(arrayOfProducts);
        }
      });
    });

    describe("given a query that doesnt match something in the database", () => {
      it("should ", async () => {
        for (const url of urls.bad) {
          response = await request(app).get(url);
          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual(emptyArray);
        }
      });
    });
  });

  describe("GET /products/:id", () => {
    describe("given a valid id", () => {
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

    describe("given an invalid id", () => {
      beforeAll(async () => {
        response = await request(app).get(`/products/1999999999`);
      });

      it("should return HTTP 200", () => {
        expect(response.statusCode).toBe(200);
      });

      it("should return an empty object", () => {
        expect(response.body).toEqual(emptyObject);
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
    describe("given a bad id", () => {
      beforeAll(async () => {
        response = await request(app).put(`/products/1999999999`).send({
          name: "Great product name",
          price: 350.0,
          description: "What a great description",
          category: "Fishing",
        });
      });

      it("should return HTTP 400", () => {
        expect(response.statusCode).toBe(400);
      });

      it("should return an object with message property", () => {
        expect(response.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
          })
        );
      });
    });

    describe("given a valid id", () => {
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
    describe("given a bad id", () => {
      beforeAll(async () => {
        response = await request(app).delete(`/products/1999999999`);
      });

      it("should return HTTP 400", () => {
        expect(response.statusCode).toBe(400);
      });

      it("should return an object with message property", () => {
        expect(response.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
          })
        );
      });
    });

    describe("given a valid id", () => {
      beforeAll(async () => {
        response = await request(app).delete(`/products/${productId}`);
      });

      it("should return HTTP 204", () => {
        expect(response.statusCode).toBe(204);
      });

      it("should return nothing in the body", () => {
        expect(response.body).toEqual(emptyObject);
      });
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
