import { Router } from "express";
import { checkSchema } from "express-validator";
import { userValidationSchema } from "../utils/validationSchema.mjs";

import {
  createUserHandler,
  deleteUserByIdHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  replaceUserByIdHandler,
  updateUserByIdHandler,
} from "../handlers/users.mjs";

const userRouter = Router();

userRouter.get("/api/users", getAllUsersHandler);

// Get user by id
userRouter.get("/api/users/:id", getUserByIdHandler);

userRouter.post(
  "/api/users",
  checkSchema(userValidationSchema),
  createUserHandler
);

// PUT
userRouter.put("/api/users/:id", replaceUserByIdHandler);

// PATCH
userRouter.patch("/api/users/:id", updateUserByIdHandler);

// DELETE
userRouter.delete("/api/users/:id", deleteUserByIdHandler);

export default userRouter;
