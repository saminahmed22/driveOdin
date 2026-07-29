// Router
import Router from "express";
export const authRouter = Router();

// Controllers
import {
  renderLoginPage,
  renderRegistrationPage,
  registerUser,
} from "../controllers/authController.js";

// Passport
import passport from "passport";

// Models
import {
  authenticationStatusOnReAuth,
  forceLogin,
  forceLogout,
} from "../models/authModel.js";

// Validators
import { validationResult } from "express-validator";
import {
  validateLoginForm,
  validateRegisterForm,
} from "../middlewares/validators/authValidators.js";

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
  validateLoginForm,
  (req, res, next) => {
    const formValidationErrors = validationResult(req);

    if (!formValidationErrors.isEmpty()) {
      return renderLoginPage(req, res);
    }

    next();
  },
  passport.authenticate("local", {
    failureFlash: true,
    successRedirect: "/",
    failureRedirect: "/auth/login",
  }),
);

authRouter.post(
  "/register",
  authenticationStatusOnReAuth,
  validateRegisterForm,
  (req, res, next) => {
    const formValidationErrors = validationResult(req);

    if (!formValidationErrors.isEmpty()) {
      return renderRegistrationPage(req, res);
    }

    next();
  },
  registerUser,
  forceLogin,
);
