import { Router } from "express";
import { users } from "../utils/test-data.mjs";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { userAuthSchema } from "../utils/validationSchema.mjs";
import passport from "passport";
import "../strategies/local-strategy.mjs";

const authRouter = Router();

authRouter.post("/api/auth", passport.authenticate("local"), (req, res) => {
  res.status(200).send({ msg: "User Authenticated" });
});

authRouter.get("/api/auth/status", (req, res) => {
  console.log("Auth status called");
  console.log(req.session);
  return req.user ? res.status(200).send(req.user) : res.sendStatus(401);
});

authRouter.post("/api/auth/logout", (req, res) => {
  console.log("Logout called");
  if (!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    return res.sendStatus(200);
  });
});

export default authRouter;
