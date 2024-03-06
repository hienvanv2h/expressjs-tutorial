import { Router } from "express";
import passport from "passport";
// import "../strategies/local-strategy.mjs";
import "../strategies/discord-strategy.mjs";

const authRouter = Router();

authRouter.post("/api/auth", passport.authenticate("local"), (req, res) => {
  return res.send({ success: true, message: "Authentication succeeded" });
});

authRouter.get("/api/auth/status", (req, res) => {
  return req.user ? res.status(200).send(req.user) : res.sendStatus(401);
});

authRouter.post("/api/auth/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    return res.sendStatus(200);
  });
});

authRouter.get("/api/auth/discord", passport.authenticate("discord"));
authRouter.get(
  "/api/auth/discord/redirect",
  passport.authenticate("discord"),
  (req, res) => {
    res.sendStatus(200);
  }
);

export default authRouter;
