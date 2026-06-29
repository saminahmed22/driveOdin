import Router from "express";

// Controllers
import {
  renderLoginPage,
  renderRegistrationPage,
} from "../controllers/authController.js";

// Express Router initialization
export const authRouter = Router();

// Routes
authRouter.get("/login", renderLoginPage);
authRouter.get("/register", renderRegistrationPage);
