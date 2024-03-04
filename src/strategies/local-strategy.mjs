import passport from "passport";
import { Strategy } from "passport-local";
import { users } from "../utils/test-data.mjs";

passport.serializeUser((user, done) => {
  // this function responsible for storing validated user in session
  console.log(`Serialize user:`);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log(`Deserialize user ID: ${id}`);
  try {
    const findUser = users.find((user) => user.id === id);
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy((username, password, done) => {
    console.log(`Username: ${username}, password: ${password}`);
    try {
      const findUser = users.find((user) => user.username === username);
      if (!findUser) {
        throw new Error("User not found");
      }
      if (findUser.password !== password)
        throw new Error("Invalid credentials ");
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);

// options: {usernameField: ...}
// verify: (username, password, done: callback) => {...}
// done: (error, user?, options?)
