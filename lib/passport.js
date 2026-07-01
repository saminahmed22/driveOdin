import passport from "passport";

import { Strategy as LocalStrategy } from "passport-local";

// Password utils
import { comparePassword } from "../utils/password.utils.js";

// Models
import { findUser } from "../models/user.model.js";

async function verify(username, password, done) {
  try {
    const user = await findUser({ username });

    if (!user) {
      return done(null, false, { message: "Invalid username or password." });
    }

    const isGenuine = await comparePassword(password, user.password_hash);

    if (isGenuine) {
      done(null, user);
    } else {
      return done(null, false, { message: "Invalid username or password." });
    }
  } catch (error) {
    return done(error, { message: "An error occured." });
  }
}

const strategy = new LocalStrategy(verify);

passport.use(strategy);

passport.serializeUser(async (user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUser({ id });

    if (user) {
      done(null, user);
    }
  } catch (error) {
    done(error);
  }
});
