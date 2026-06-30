import Router from "express";

// Controllers
import {
  renderLoginPage,
  renderRegistrationPage,
} from "../controllers/authController.js";

// Models
import { registerUser } from "../models/user.model.js";

// Express Router initialization
export const authRouter = Router();

// Routes

//____Get
authRouter.get("/login", renderLoginPage);
authRouter.get("/register", renderRegistrationPage);

//____Post
authRouter.post("/login", renderLoginPage);
authRouter.post("/register", registerUser);
