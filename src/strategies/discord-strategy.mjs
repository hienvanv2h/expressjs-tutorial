import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUserModel } from "../mongoose/schemas/discord-user.mjs";

const options = {
  clientID: "1214517615561674823",
  clientSecret: "njMtEjS8YkABeN9JoEiOQJpbRpZfWeRO",
  callbackURL: "http://localhost:3000/api/auth/discord/redirect",
  scope: ["identify", "email", "guilds"],
};

passport.serializeUser((user, done) => {
  // this function responsible for storing validated user in session
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await DiscordUserModel.findById(id);
    return findUser ? done(null, findUser) : done(null, null);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(options, async (accessToken, refreshToken, profile, done) => {
    let findUser;
    try {
      findUser = await DiscordUserModel.findOne({ discordId: profile.id });
    } catch (err) {
      return done(err, null, { message: err.message });
    }

    try {
      if (!findUser) {
        // user not exist - create new user and save to db
        const newUser = new DiscordUserModel({
          username: profile.username,
          email: profile.email,
          discordId: profile.id,
        });
        const newSavedUser = await newUser.save();
        return done(null, newSavedUser);
      }
      // else next
      return done(null, findUser);
    } catch (err) {
      return done(err, null, { message: err.message });
    }
  })
);
