import { UserModel } from "../mongoose/schemas/user.mjs";
import { validationResult, matchedData } from "express-validator";
import { hashPassword } from "../utils/helpers.mjs";

export const getAllUsersHandler = async (req, res) => {
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
};

export const getUserByIdHandler = async (req, res) => {
  try {
    const theUser = await UserModel.findById(req.params.id);
    if (!theUser) return res.sendStatus(404);
    else return res.status(200).send(theUser);
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).send({ error: "Invalid ID" });
    return res.status(500).send({ error: err });
  }
};

export const createUserHandler = async (req, res) => {
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
};

export const replaceUserByIdHandler = async (req, res) => {
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
};

export const updateUserByIdHandler = async (req, res) => {
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
};

export const deleteUserByIdHandler = async (req, res) => {
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
};
