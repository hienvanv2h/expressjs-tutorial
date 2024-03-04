import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { userValidationSchema } from "../utils/validationSchema.mjs";
import { users } from "../utils/test-data.mjs";

const userRouter = Router();
userRouter.get("/api/users", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  const {
    query: { filter, value },
  } = req;
  if (!filter || !value) return res.status(200).send(users);

  return res.send(users.filter((user) => user[filter].includes(value)));
});

// Get user by id
userRouter.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: "Bad Request - Invalid ID" });
  }
  const theUser = users.find((user) => user.id === parsedId);
  if (!theUser) return res.sendStatus(404);
  else return res.status(200).send(theUser);
});

userRouter.post("/api/users", checkSchema(userValidationSchema), (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).send({ errors: result.array() });

  const data = matchedData(req);
  const newUser = { id: users[users.length - 1].id + 1, ...data };
  users.push(newUser);
  return res.status(201).send(newUser);
});

// PUT
userRouter.put("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  const requestBody = req.body;
  if (isNaN(parsedId)) return res.status(400).send({ error: "Invalid ID" });

  const userIndex = users.findIndex((user) => user.id === parsedId);
  if (userIndex === -1) return res.sendStatus(404);
  users[userIndex] = { id: parsedId, ...requestBody };
  return res.sendStatus(200);
});

// PATCH
userRouter.patch("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  const requestBody = req.body;
  if (isNaN(parsedId)) return res.status(400).send({ error: "Invalid ID" });

  const userIndex = users.findIndex((user) => user.id === parsedId);
  if (userIndex === -1) return res.sendStatus(404);
  users[userIndex] = { ...users[userIndex], ...requestBody };
  return res.sendStatus(200);
});

// DELETE
userRouter.delete("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) return res.status(400).send({ error: "Invalid ID" });

  const userIndex = users.findIndex((user) => user.id === parsedId);
  if (userIndex === -1) return res.sendStatus(404);
  const removedUser = users.splice(userIndex, 1);
  return res
    .status(200)
    .send({ message: `Removed username: ${removedUser[0].username}` });
});

export default userRouter;
