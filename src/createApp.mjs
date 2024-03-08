import express from "express";
import rootRouter from "./routes/root.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

export default function createApp() {
  const app = express();

  app.use(express.json()); // register new middleware
  // register cookie parser before add routes
  app.use(cookieParser("secretstring"));
  // register session
  app.use(
    session({
      secret: "randomsecret",
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000 * 60,
      },
      store: MongoStore.create({
        client: mongoose.connection.getClient(), // NOTE: require Db connected before create app
      }),
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  // add router
  app.use(rootRouter);

  return app;
}
