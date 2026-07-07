// Router
import Router from "express";
export const authRouter = Router();

// Controllers
import {
  renderLoginPage,
  renderRegistrationPage,
  registerUser,
} from "../controllers/auth.controller.js";

// Passport
import passport from "passport";

// Middlewares
import {
  authenticationStatusOnReAuth,
  forceLogin,
  forceLogout,
} from "../middlewares/authenticationStatus.js";

// Routes

//____Get
authRouter.get("/login", authenticationStatusOnReAuth, renderLoginPage);
authRouter.get("/log-out", forceLogout);

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
    failureRedirect: "/auth/login",
  }),
);

authRouter.post(
  "/register",
  authenticationStatusOnReAuth,
  registerUser,
  forceLogin,
);
