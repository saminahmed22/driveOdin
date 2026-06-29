import Router from "express";

// Controllers
import { renderLoginPage } from "../controllers/loginController.js";
import { renderRegistrationPage } from "../controllers/registerController.js";

// Express Router initialization
export const authRouter = Router();

// Routes
authRouter.get("/login", renderLoginPage);
authRouter.get("/register", renderRegistrationPage);
