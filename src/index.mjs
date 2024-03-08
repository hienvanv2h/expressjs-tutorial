import mongoose from "mongoose";
import createApp from "./createApp.mjs";

mongoose
  .connect("mongodb://localhost:27017/expressjs_tutorial")
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(`Error: ${err}`));

const app = createApp();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  req.session.visited = true; // modify session data object

  res.cookie("cookieName", "HelloWorld", { maxAge: 60000 * 60, signed: true });
  res.status(200).send("<h1>Welcome to ExpressJS Tutorial</h1>");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
