import mongoose from "mongoose";
import createApp from "../createApp.mjs";
import request from "supertest";

// Testing User Authentication (Local strategy)
describe("Create user and login", () => {
  let app;
  beforeAll(() => {
    mongoose
      .connect("mongodb://localhost/express_tutorial_test")
      .then(() => console.log("Connected to Test Database"))
      .catch((err) => console.log(`Error: ${err}`));

    app = createApp();
  });

  const theUser = {
    username: "jimmy123@email.com",
    password: "test12345",
    displayName: "Jimmy The Dev",
  };

  it("should create user", async () => {
    const response = await request(app).post("/api/users").send(theUser);
    expect(response.statusCode).toBe(201);
  });

  it("should log the user in and get authenticated user via /api/auth/status", async () => {
    const { username, password } = theUser;
    const response = await request(app)
      .post("/api/auth")
      .send({ username, password })
      .then((res) => {
        return request(app)
          .get("/api/auth/status")
          .set("Cookie", res.headers["set-cookie"]);
      });
    console.log("response:", response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(theUser.username);
    expect(response.body.displayName).toBe(theUser.displayName);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
