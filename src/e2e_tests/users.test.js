import mongoose from "mongoose";
import createApp from "../createApp.mjs";
import request from "supertest";

describe("Test user router", () => {
  // it("should pass", () => {});
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
  let userId;

  it("should create new user in db", async () => {
    const response = await request(app).post("/api/users").send(theUser);
    expect(response.statusCode).toBe(201);
  });

  it("should get all users", async () => {
    const allUsers = [];
    if (allUsers.length === 0) allUsers.push(theUser);

    const response = await request(app).get("/api/users");
    console.log("=== GET ALL USERS ===");
    console.log(response.headers);
    console.log(response.body);
    userId = response.body[0]._id;
    console.log("UserId:", userId);
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("application/json");
    expect(response.body.length).toEqual(allUsers.length);
    expect(response.body[0].username).toBe(allUsers[0].username);
  });

  it("should get user by id", async () => {
    const response = await request(app).get(`/api/users/${userId}`);
    console.log("=== GET by ID ===");
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(theUser.username);
  });

  it("should patch user by id", async () => {
    const patchedUser = { displayName: "Jimmy Kennel" };
    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .send(patchedUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.matchedCount).toBe(1);
    expect(response.body.modifiedCount).toBe(1);
  });

  it("should update user by id", async () => {
    const updatedUser = { ...theUser, username: "jimmydev@email.com" };
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send(updatedUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.matchedCount).toBe(1);
    expect(response.body.modifiedCount).toBe(1);
  });

  it("should get patched user by id", async () => {
    const response = await request(app).get(`/api/users/${userId}`);
    console.log("=== GET UPDATED USER by ID ===");
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe("jimmydev@email.com");
    expect(response.body.displayName).toBe(theUser.displayName);
  });

  it("should delete user by id", async () => {
    const response = await request(app).delete(`/api/users/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.deletedCount).toBe(1);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
