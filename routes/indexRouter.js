import Router from "express";

// Controllers
import { renderIndex } from "../controllers/indexController.js";

// Middlewares
import { authenticationStatus } from "../middlewares/authenticationStatus.js";

// Express Router initialization
export const indexRouter = Router();

// Routes
indexRouter.get("/", authenticationStatus, renderIndex);
