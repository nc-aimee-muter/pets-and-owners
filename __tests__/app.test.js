const request = require("supertest");
const fs = require("fs/promises");
const { describe, test, expect } = require("@jest/globals");
const { makeRainbow, styleError } = require("../index");
const endpointsData = require("../endpoints.json");
const app = require("../app");

const numberOfTests = 6;
let numberOfRefreshes = 0;

beforeEach(async () => {
  numberOfRefreshes++;
  if (numberOfRefreshes === numberOfTests)
    console.log(makeRainbow("Refreshing data..."));
  try {
    await Promise.all([
      fs.cp("./source-data/owners", "./data/owners", { recursive: true }),
      fs.cp("./source-data/pets", "./data/pets", { recursive: true }),
    ]);
  } catch (error) {
    console.log(styleError("Something went wrong!"));
  }
});

describe("*", () => {
  test("404: responds to the client with an error message if endpoint not hit", async () => {
    const response = await request(app).get("/nonsense").expect(404);
    const {
      body: { message },
    } = response;
    expect(message).toBe(
      "This endpoint does not exist... /api provides endpoint information"
    );
  });
});

describe("app.js", () => {
  describe("GET /api", () => {
    test("GET 200: responds to the client with an object describing all the available endpoints", async () => {
      const response = await request(app).get("/api").expect(200);
      const {
        body: { apiInfo },
      } = response;
      expect(apiInfo).toEqual(endpointsData);
    });
  });
  describe("GET /api/owners/:id", () => {
    test("GET 200: responds to the client with the owner matching the provided id", async () => {
      const {
        body: { owner },
      } = await request(app).get("/api/owners/o4").expect(200);
      expect(owner).toEqual({
        id: "o4",
        name: "Malcolm",
        age: 92,
      });
    });
    test("GET 200: reponds to the client with the owner matching the provided id despite casing", async () => {
      const {
        body: { owner },
      } = await request(app).get("/api/owners/O2").expect(200);
      expect(owner).toEqual({ id: "o2", name: "Lucy", age: 19 });
    });
    test("GET 404: responds to the client with an error message if the id is valid but not found", async () => {
      const {
        body: { message },
      } = await request(app).get("/api/owners/o1000").expect(404);
      expect(message).toBe("No owner matching the provided ID");
    });
    test("GET 400: responds to the client with an error message if the id is invalid", async () => {
      const {
        body: { message },
      } = await request(app).get("/api/owners/owner1").expect(400);
      expect(message).toBe("Invalid ID");
    });
  });
});
