import passport from "passport";
import { Strategy } from "passport-local";
import { UserModel } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((user, done) => {
  // this function responsible for storing validated user in session
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await UserModel.findById(id);
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await UserModel.findOne({ username });
      if (!findUser) throw new Error("User Not Found");
      if (!comparePassword(password, findUser.password)) {
        throw new Error("Bad Credentials");
      }
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);

// options: {usernameField: ...}
// verify: (username, password, done: callback) => {...}
// done: (error, user?, options?)
