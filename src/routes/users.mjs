import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { userValidationSchema } from "../utils/validationSchema.mjs";
import { UserModel } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const userRouter = Router();

userRouter.get("/api/users", async (req, res) => {
  try {
    const {
      query: { filter, value },
    } = req;
    if (!filter || !value) {
      const allUsers = await UserModel.find({});
      return res.status(200).send(allUsers);
    }
    const filterUsers = await UserModel.find({ filter: value });
    return res.send(filterUsers);
  } catch (err) {
    return res.status(500).send({ error: err });
  }
});

// Get user by id
userRouter.get("/api/users/:id", async (req, res) => {
  try {
    const theUser = await UserModel.findById(req.params.id);
    if (!theUser) return res.sendStatus(404);
    else return res.status(200).send(theUser);
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).send({ error: "Invalid ID" });
    return res.status(500).send({ error: err });
  }
});

userRouter.post(
  "/api/users",
  checkSchema(userValidationSchema),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });

    const data = matchedData(req);
    data.password = hashPassword(data.password); // hash before saving in db

    const newUser = new UserModel(data);
    try {
      const savedUser = await newUser.save();
      return res.status(201).send(savedUser);
    } catch (err) {
      return res.sendStatus(400);
    }
  }
);

// PUT
userRouter.put("/api/users/:id", async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const update = req.body;

    const result = await UserModel.replaceOne(filter, update);
    if (!result.matchedCount)
      return res.status(404).send({ error: "User not found" });

    return res.status(200).send(result);
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).send({ error: "Invalid ID" });
    return res.status(500).send({ error: err });
  }
});

// PATCH
userRouter.patch("/api/users/:id", async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const update = req.body;

    const result = await UserModel.updateOne(filter, update);
    if (!result.matchedCount)
      return res.status(404).send({ error: "User not found" });

    return res.status(200).send(result);
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).send({ error: "Invalid ID" });
    return res.status(500).send({ error: err });
  }
});

// DELETE
userRouter.delete("/api/users/:id", async (req, res) => {
  try {
    const filter = { _id: req.params.id };

    const result = await UserModel.deleteOne(filter);
    if (!result.deletedCount)
      return res.status(404).send({ error: "User not found" });

    return res.status(200).send(result);
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).send({ error: "Invalid ID" });
    return res.status(500).send({ error: err });
  }
});

export default userRouter;
