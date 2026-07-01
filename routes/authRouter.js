import Router from "express";

// Controllers
import {
  renderLoginPage,
  renderRegistrationPage,
} from "../controllers/authController.js";

// Models
import { registerUser } from "../models/user.model.js";

// Passport
import passport from "passport";

// Middlewares
function authenticationStatusOnReAuth(req, res, next) {
  const status = req.isAuthenticated();

  if (status) {
    return res.redirect("/");
  } else {
    next();
  }
}

// Express Router initialization
export const authRouter = Router();

// Routes

//____Get
authRouter.get("/login", authenticationStatusOnReAuth, renderLoginPage);
authRouter.get(
  "/log-out",
  (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      } else {
        res.redirect("/auth/login");
      }
    });
  },
  renderLoginPage,
);

authRouter.get(
  "/register",
  authenticationStatusOnReAuth,
  renderRegistrationPage,
);

//____Post
authRouter.post(
  "/login",
  authenticationStatusOnReAuth,
  passport.authenticate("local", {
    failureFlash: true,
    successRedirect: "/",
    failureRedirect: "/login",
  }),
);

authRouter.post(
  "/register",
  authenticationStatusOnReAuth,
  registerUser,
  (req, res) => {
    req.login(req.user, (error) => {
      if (error) {
        next(error);
      } else {
        res.redirect("/");
      }
    });
  },
);
