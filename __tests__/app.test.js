const request = require("supertest");
const fs = require("fs/promises");
const { describe, test, expect } = require("@jest/globals");
const { makeRainbow, styleError } = require("../index");
const endpointsData = require("../endpoints.json");
const app = require("../app");

const numberOfTests = 10;
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
    test("GET 200: responds to the client with the owner matching the provided id despite casing", async () => {
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
  describe("GET /owners", () => {
    test("GET 200: responds to the client with an array containing every owner object", async () => {
      const {
        body: { owners },
      } = await request(app).get("/api/owners").expect(200);
      expect(owners).toEqual([
        {
          id: "o1",
          name: "Steve",
          age: 28,
        },
        {
          id: "o2",
          name: "Lucy",
          age: 19,
        },
        {
          id: "o3",
          name: "Gavin",
          age: 33,
        },
        {
          id: "o4",
          name: "Malcolm",
          age: 92,
        },
        {
          id: "o5",
          name: "Ronald",
          age: 57,
        },
        {
          id: "o6",
          name: "Grumpy",
          age: 30,
        },
      ]);
    });
  });
  describe("GET /owners/:id/pets", () => {
    test("GET 200: responds to the client with an array of all pets belonging to the owner matching the provided id", async () => {
      const {
        body: { pets },
      } = await request(app).get("/api/owners/o1/pets").expect(200);
      expect(pets).toEqual([
        {
          id: "p1",
          name: "Alan Turin",
          avatarUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjOqKI0kZG7nIV2w7AFRWfPUGiqeM0J26TbCp8irR1jZiNG556",
          favouriteFood: "Digestive Biscuits",
          owner: "o1",
          age: 10,
          temperament: "aggressive",
        },
        {
          id: "p4",
          name: "Dunston",
          avatarUrl:
            "https://media.mnn.com/assets/images/2010/02/baby-orangutan.jpg.1000x0_q80_crop-smart.jpg",
          favouriteFood: "Fish and Chips",
          owner: "o1",
          age: 4,
          temperament: "aggressive",
        },
        {
          id: "p11",
          name: "Greg Attenborough",
          avatarUrl:
            "http://static.boredpanda.com/blog/wp-content/uuuploads/cute-baby-animals/cute-baby-animals-2.jpg",
          favouriteFood: "Cucumber Sandwiches",
          owner: "o1",
          age: 12,
          temperament: "passive",
        },
      ]);
    });
    test("GET 200: responds to the client with an array of all pets belonging to the owner matching the provided id despite casing", async () => {
      const {
        body: { pets },
      } = await request(app).get("/api/owners/O1/pets").expect(200);
      expect(pets).toEqual([
        {
          id: "p1",
          name: "Alan Turin",
          avatarUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjOqKI0kZG7nIV2w7AFRWfPUGiqeM0J26TbCp8irR1jZiNG556",
          favouriteFood: "Digestive Biscuits",
          owner: "o1",
          age: 10,
          temperament: "aggressive",
        },
        {
          id: "p4",
          name: "Dunston",
          avatarUrl:
            "https://media.mnn.com/assets/images/2010/02/baby-orangutan.jpg.1000x0_q80_crop-smart.jpg",
          favouriteFood: "Fish and Chips",
          owner: "o1",
          age: 4,
          temperament: "aggressive",
        },
        {
          id: "p11",
          name: "Greg Attenborough",
          avatarUrl:
            "http://static.boredpanda.com/blog/wp-content/uuuploads/cute-baby-animals/cute-baby-animals-2.jpg",
          favouriteFood: "Cucumber Sandwiches",
          owner: "o1",
          age: 12,
          temperament: "passive",
        },
      ]);
    });
    test("GET 200: responds to the client with an empty pets array if no pets are found for the owner matching the provided id", async () => {
      const {
        body: { pets },
      } = await request(app).get("/api/owners/o6/pets").expect(200);
      expect(pets).toEqual([]);
    });
  });
});
