import express from "express";
import rootRouter from "./routes/root.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

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
  })
);
app.use(passport.initialize());
app.use(passport.session());
// add router
app.use(rootRouter);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true; // modify session data object

  res.cookie("cookieName", "HelloWorld", { maxAge: 60000 * 60, signed: true });
  res.status(200).send("<h1>Welcome to ExpressJS Tutorial</h1>");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
